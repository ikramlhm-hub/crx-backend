import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { productsController } from './products.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function productsRoutes(app: FastifyInstance) {

  // Routes publiques
  app.get('/products', productsController.getAllProducts)
  app.get('/products/:id', productsController.getProductById)

  // Routes privées — marque uniquement
  app.get('/products/me', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    productsController.getMyProducts(req, reply)
  )

  app.post('/products', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    productsController.createProduct(req, reply)
  )

  app.patch('/products/:id', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    productsController.updateProduct(req, reply)
  )

  app.delete('/products/:id', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    productsController.deleteProduct(req, reply)
  )
}