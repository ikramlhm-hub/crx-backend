import { PrismaClient, Role, ApplicationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed CRX...')

  const passwordHash = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'createur@crx.fr' },
    update: {
      password: passwordHash,
      role: Role.BRAND,
      newsletterSubscribed: true,
    },
    create: {
      email: 'createur@crx.fr',
      password: passwordHash,
      role: Role.BRAND,
      newsletterSubscribed: true,
    },
  })

  const brand = await prisma.brand.upsert({
    where: { slug: 'kreateur' },
    update: {
      name: 'KREATEUR',
      description:
        'KREATEUR est une marque indépendante française qui propose des pièces streetwear responsables, produites en petites séries.',
      story:
        'Née d’une envie de créer des vêtements avec une vraie identité, KREATEUR valorise les coupes fortes, les matières durables et les productions limitées.',
      banner: '/icons/articles/article1.png',
      logo: '/icons/logo.png',
      credits: 1000,
      isActive: true,
      status: ApplicationStatus.APPROVED,
    },
    create: {
      userId: user.id,
      name: 'KREATEUR',
      slug: 'kreateur',
      description:
        'KREATEUR est une marque indépendante française qui propose des pièces streetwear responsables, produites en petites séries.',
      story:
        'Née d’une envie de créer des vêtements avec une vraie identité, KREATEUR valorise les coupes fortes, les matières durables et les productions limitées.',
      banner: '/icons/articles/article1.png',
      logo: '/icons/logo.png',
      credits: 1000,
      isActive: true,
      status: ApplicationStatus.APPROVED,
    },
  })

  await prisma.product.upsert({
    where: { id: 'cmohqiv0s0009g8u1zip5y7e4' },
    update: {
      brandId: brand.id,
      name: 'Veste IELO',
      description:
        'Veste unisexe pensée pour un style urbain et minimaliste. Coupe confortable, finitions soignées et production limitée.',
      price: 89.99,
      stock: 12,
      images: ['/icons/articles/article1.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Noir', 'Blanc'],
      isActive: true,
    },
    create: {
      id: 'cmohqiv0s0009g8u1zip5y7e4',
      brandId: brand.id,
      name: 'Veste IELO',
      description:
        'Veste unisexe pensée pour un style urbain et minimaliste. Coupe confortable, finitions soignées et production limitée.',
      price: 89.99,
      stock: 12,
      images: ['/icons/articles/article1.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Noir', 'Blanc'],
      isActive: true,
    },
  })

  await prisma.product.upsert({
    where: { id: 'crx-tshirt-city-white-xl' },
    update: {
      brandId: brand.id,
      name: 'T-shirt City',
      description:
        'T-shirt blanc en coton, inspiré par l’énergie des grandes villes et les silhouettes contemporaines.',
      price: 39.99,
      stock: 25,
      images: ['/icons/articles/article2.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blanc'],
      isActive: true,
    },
    create: {
      id: 'crx-tshirt-city-white-xl',
      brandId: brand.id,
      name: 'T-shirt City',
      description:
        'T-shirt blanc en coton, inspiré par l’énergie des grandes villes et les silhouettes contemporaines.',
      price: 39.99,
      stock: 25,
      images: ['/icons/articles/article2.png'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blanc'],
      isActive: true,
    },
  })

  await prisma.product.upsert({
    where: { id: 'crx-pantalon-noir' },
    update: {
      brandId: brand.id,
      name: 'Pantalon Noir Studio',
      description:
        'Pantalon noir à coupe droite, conçu pour accompagner une garde-robe indépendante, sobre et durable.',
      price: 69.99,
      stock: 18,
      images: ['/icons/articles/article3.png'],
      sizes: ['S', 'M', 'L'],
      colors: ['Noir'],
      isActive: true,
    },
    create: {
      id: 'crx-pantalon-noir',
      brandId: brand.id,
      name: 'Pantalon Noir Studio',
      description:
        'Pantalon noir à coupe droite, conçu pour accompagner une garde-robe indépendante, sobre et durable.',
      price: 69.99,
      stock: 18,
      images: ['/icons/articles/article3.png'],
      sizes: ['S', 'M', 'L'],
      colors: ['Noir'],
      isActive: true,
    },
  })

  console.log('✅ Seed terminé avec succès.')
}

main()
  .catch((error) => {
    console.error('❌ Erreur pendant le seed :', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })