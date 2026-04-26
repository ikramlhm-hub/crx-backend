import { prisma } from '../../lib/prisma'
import { creditsService } from '../credits/credits.service'

export const adminService = {

  // ─── MARQUES ───────────────────────────────────────

  async getAllBrands() {
    return prisma.brand.findMany({
      include: {
        user: {
          select: { email: true }
        },
        products: true,
        serviceRequests: true
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async approveBrand(brandId: string) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: {
        status: 'APPROVED',
        isActive: true
      }
    })

    if (brand.credits === 0) {
      await creditsService.addCredits(
        brandId,
        1000,
        'Crédits de bienvenue — candidature approuvée'
      )
    }

    return updated
  },

  async rejectBrand(brandId: string, message?: string) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return prisma.brand.update({
      where: { id: brandId },
      data: {
        status: 'REJECTED',
        isActive: false
      }
    })
  },

  async addCreditsToBrand(brandId: string, amount: number, description: string) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    await creditsService.addCredits(brandId, amount, description)

    return prisma.brand.findUnique({
      where: { id: brandId },
      select: { id: true, name: true, credits: true }
    })
  },

  // ─── SERVICES ──────────────────────────────────────

  async getAllServiceRequests() {
    return prisma.serviceRequest.findMany({
      include: {
        brand: {
          select: { name: true, slug: true, credits: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async approveService(serviceId: string) {
    const service = await prisma.serviceRequest.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      throw new Error('SERVICE_NOT_FOUND')
    }

    return prisma.serviceRequest.update({
      where: { id: serviceId },
      data: { status: 'APPROVED' }
    })
  },

  async rejectService(serviceId: string) {
    const service = await prisma.serviceRequest.findUnique({
      where: { id: serviceId },
      include: { brand: true }
    })

    if (!service) {
      throw new Error('SERVICE_NOT_FOUND')
    }

    await prisma.$transaction(async (tx) => {
      await tx.brand.update({
        where: { id: service.brandId },
        data: { credits: { increment: service.cost } }
      })

      await tx.creditLog.create({
        data: {
          brandId: service.brandId,
          amount: service.cost,
          description: `Remboursement service refusé : ${service.type}`
        }
      })

      await tx.serviceRequest.update({
        where: { id: serviceId },
        data: { status: 'REJECTED' }
      })
    })

    return { message: 'Service refusé et crédits remboursés' }
  },

  async completeService(serviceId: string) {
    const service = await prisma.serviceRequest.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      throw new Error('SERVICE_NOT_FOUND')
    }

    return prisma.serviceRequest.update({
      where: { id: serviceId },
      data: { status: 'COMPLETED' }
    })
  },

  // ─── STATS ─────────────────────────────────────────

  async getDashboardStats() {
    const [
      totalBrands,
      activeBrands,
      pendingBrands,
      totalOrders,
      totalProducts,
      pendingServices
    ] = await Promise.all([
      prisma.brand.count(),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.brand.count({ where: { status: 'PENDING' } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.serviceRequest.count({ where: { status: 'PENDING' } })
    ])

    const revenue = await prisma.order.aggregate({
      _sum: { total: true }
    })

    return {
      totalBrands,
      activeBrands,
      pendingBrands,
      totalOrders,
      totalProducts,
      pendingServices,
      totalRevenue: revenue._sum.total || 0
    }
  }
}