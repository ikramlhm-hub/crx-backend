import Fastify from 'fastify'
import dotenv from 'dotenv'
import { authRoutes } from './modules/auth/auth.routes'
import { brandsRoutes } from './modules/brands/brands.routes'
import { productsRoutes } from './modules/products/products.routes'
import { ordersRoutes } from './modules/orders/orders.routes'
import { creditsRoutes } from './modules/credits/credits.routes'
import { adminRoutes } from './modules/admin/admin.routes'
import { startCreditsCron } from './jobs/creditsCron'
import { newsletterRoutes } from './modules/newsletter/newsletter.routes'

dotenv.config()

const app = Fastify({ logger: true })

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

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

startCreditsCron()
start()