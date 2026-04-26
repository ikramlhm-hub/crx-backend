import { prisma } from '../../lib/prisma'

export const newsletterService = {

  async subscribe(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { newsletterSubscribed: true },
      select: { id: true, email: true, newsletterSubscribed: true }
    })
  },

  async unsubscribe(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { newsletterSubscribed: false },
      select: { id: true, email: true, newsletterSubscribed: true }
    })
  },

  async getSubscribers(): Promise<{ email: string }[]> {
    return prisma.user.findMany({
      where: { newsletterSubscribed: true },
      select: { email: true }
    })
  }
}