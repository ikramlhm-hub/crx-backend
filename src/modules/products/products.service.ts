import { prisma } from '../../lib/prisma'

export const productsService = {

  async createProduct(userId: string, data: {
    name: string
    description?: string
    price: number
    stock: number
    sizes?: string[]
    colors?: string[]
    images?: string[]
  }) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const product = await prisma.product.create({
      data: {
        brandId: brand.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        sizes: data.sizes || [],
        colors: data.colors || [],
        images: data.images || []
      }
    })

    return product
  },

  async getMyProducts(userId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return prisma.product.findMany({
      where: { brandId: brand.id },
      orderBy: { createdAt: 'desc' }
    })
  },

  async updateProduct(userId: string, productId: string, data: {
    name?: string
    description?: string
    price?: number
    stock?: number
    sizes?: string[]
    colors?: string[]
    images?: string[]
    isActive?: boolean
  }) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, brandId: brand.id }
    })

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND')
    }

    return prisma.product.update({
      where: { id: productId },
      data
    })
  },

  async deleteProduct(userId: string, productId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, brandId: brand.id }
    })

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND')
    }

    await prisma.product.delete({
      where: { id: productId }
    })
  },

  async getAllProducts(filters?: {
    minPrice?: number
    maxPrice?: number
    sizes?: string[]
    colors?: string[]
  }) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        brand: { isActive: true },
        ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
        ...(filters?.maxPrice && { price: { lte: filters.maxPrice } })
      },
      include: {
        brand: {
          select: {
            name: true,
            slug: true,
            logo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getProductById(productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      include: {
        brand: {
          select: {
            name: true,
            slug: true,
            logo: true,
            description: true
          }
        }
      }
    })

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND')
    }

    return product
  }
}