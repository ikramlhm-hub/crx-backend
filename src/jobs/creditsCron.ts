import cron from 'node-cron'
import { prisma } from '../lib/prisma'

export function startCreditsCron() {
  // Tous les 1er du mois à minuit
  cron.schedule('0 0 1 * *', async () => {
    console.log('🕐 Cron crédits mensuel démarré...')

    const activeBrands = await prisma.brand.findMany({
      where: { isActive: true }
    })

    for (const brand of activeBrands) {
      await prisma.$transaction(async (tx) => {
        await tx.brand.update({
          where: { id: brand.id },
          data: { credits: { increment: 1000 } }
        })

        await tx.creditLog.create({
          data: {
            brandId: brand.id,
            amount: 1000,
            description: 'Crédits mensuels — abonnement actif'
          }
        })
      })
    }

    console.log(`✅ ${activeBrands.length} marques créditées de 1000 crédits`)
  })
}