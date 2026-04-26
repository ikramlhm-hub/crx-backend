import { prisma } from '../../lib/prisma'

export const ordersService = {

  async createOrder(userId: string, data: {
    items: { productId: string; quantity: number }[]
    address: {
      street: string
      city: string
      zipCode: string
      country: string
    }
  }) {
    // Vérifier que tous les produits existent et ont assez de stock
    const productIds = data.items.map(i => i.productId)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }
    })

    if (products.length !== data.items.length) {
      throw new Error('PRODUCT_NOT_FOUND')
    }

    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId)!
      if (product.stock < item.quantity) {
        throw new Error('INSUFFICIENT_STOCK')
      }
    }

    // Calculer le total
    const total = data.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    // Créer la commande + items + mettre à jour le stock
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          address: data.address,
          items: {
            create: data.items.map(item => {
              const product = products.find(p => p.id === item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
              }
            })
          }
        },
        include: { items: true }
      })

      // Décrémenter le stock de chaque produit
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      return newOrder
    })

    return order
  },

  async getMyOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                brand: {
                  select: { name: true, slug: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                brand: {
                  select: { name: true, slug: true }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      throw new Error('ORDER_NOT_FOUND')
    }

    return order
  },

  async getBrandOrders(userId: string) {
    const brand = await prisma.brand.findUnique({
      where: { userId }
    })

    if (!brand) {
      throw new Error('BRAND_NOT_FOUND')
    }

    return prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { brandId: brand.id }
          }
        }
      },
      include: {
        items: {
          where: {
            product: { brandId: brand.id }
          },
          include: {
            product: {
              select: { name: true, images: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async updateOrderStatus(orderId: string, status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('ORDER_NOT_FOUND')
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  }
}