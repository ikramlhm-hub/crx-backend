import { prisma } from '../../lib/prisma'

const SERVICE_COSTS = {
  HOMEPAGE_HIGHLIGHT: 200,
  SOCIAL_POST: 300,
  PHYSICAL_STORE: 500,
  PHOTO_SHOOT: 400,
  EVENT: 350,
  NEWSLETTER: 250
}

export const creditsService = {

  async getCredits(userId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId },
      select: {
        id: true,
        credits: true,
        creditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return brand
  },

  async requestService(userId: string, data: {
    type: keyof typeof SERVICE_COSTS
    details?: any
  }) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const cost = SERVICE_COSTS[data.type]

    if (brand.credits < cost) {
      throw new Error('INSUFFICIENT_CREDITS')
    }

    // Transaction : déduire les crédits + créer la demande
    const result = await prisma.$transaction(async (tx) => {
      // Déduire les crédits
      await tx.brand.update({
        where: { id: brand.id },
        data: { credits: { decrement: cost } }
      })

      // Logger le mouvement
      await tx.creditLog.create({
        data: {
          brandId: brand.id,
          amount: -cost,
          description: `Service demandé : ${data.type}`
        }
      })

      // Créer la demande de service
      const serviceRequest = await tx.serviceRequest.create({
        data: {
          brandId: brand.id,
          type: data.type,
          cost,
          details: data.details || {},
          status: 'PENDING'
        }
      })

      return serviceRequest
    })

    return result
  },

  async getMyServices(userId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return prisma.serviceRequest.findMany({
      where: { brandId: brand.id },
      orderBy: { createdAt: 'desc' }
    })
  },

  async addCredits(brandId: string, amount: number, description: string) {
    await prisma.$transaction(async (tx) => {
      await tx.brand.update({
        where: { id: brandId },
        data: { credits: { increment: amount } }
      })

      await tx.creditLog.create({
        data: {
          brandId,
          amount,
          description
        }
      })
    })
  },

  async getServiceCosts() {
    return SERVICE_COSTS
  }
}