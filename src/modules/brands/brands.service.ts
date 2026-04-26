import { prisma } from '../../lib/prisma'

export const brandsService = {

  async getMyBrand(userId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId },
      include: {
        products: true,
        creditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return brand
  },

  async createBrand(userId: string, data: {
    name: string
    description?: string
    story?: string
  }) {
    const existing = await prisma.brand.findUnique({
      where: { userId }
    })

    if (existing) {
      throw new Error('BRAND_ALREADY_EXISTS')
    }

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const brand = await prisma.brand.create({
      data: {
        userId,
        name: data.name,
        slug,
        description: data.description,
        story: data.story,
        credits: 1000
      }
    })

    await prisma.creditLog.create({
      data: {
        brandId: brand.id,
        amount: 1000,
        description: 'Crédits offerts à l\'inscription'
      }
    })

    return brand
  },

  async updateBrand(userId: string, data: {
    name?: string
    description?: string
    story?: string
    banner?: string
    logo?: string
  }) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const updated = await prisma.brand.update({
      where: { userId },
      data
    })

    return updated
  },

  async getAllBrands() {
    return prisma.brand.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        banner: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getBrandBySlug(slug: string) {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true }
        }
      }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return brand
  }
}