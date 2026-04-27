import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import { authRoutes } from './modules/auth/auth.routes'
import { brandsRoutes } from './modules/brands/brands.routes'
import { productsRoutes } from './modules/products/products.routes'
import { ordersRoutes } from './modules/orders/orders.routes'
import { creditsRoutes } from './modules/credits/credits.routes'
import { adminRoutes } from './modules/admin/admin.routes'
import { newsletterRoutes } from './modules/newsletter/newsletter.routes'
import { startCreditsCron } from './jobs/creditsCron'

dotenv.config()

const app = Fastify({ logger: true })

const start = async () => {
  try {
    await app.register(cors, {
      origin: [
        'http://localhost:3000',
        'https://crx-market.fr',
        'https://www.crx-market.fr',
        /\.vercel\.app$/
      ],
      credentials: true
    })

    app.register(authRoutes, { prefix: '/api' })
    app.register(brandsRoutes, { prefix: '/api' })
    app.register(productsRoutes, { prefix: '/api' })
    app.register(ordersRoutes, { prefix: '/api' })
    app.register(creditsRoutes, { prefix: '/api' })
    app.register(adminRoutes, { prefix: '/api' })
    app.register(newsletterRoutes, { prefix: '/api' })

    app.get('/health', async () => {
      return { status: 'ok', project: 'CRX Backend' }
    })

    startCreditsCron()

    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()