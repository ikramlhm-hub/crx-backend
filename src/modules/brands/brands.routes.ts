import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { brandsController } from './brands.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function brandsRoutes(app: FastifyInstance) {

  // Routes publiques
  app.get('/brands', brandsController.getAllBrands)
  app.get('/brands/:slug', brandsController.getBrandBySlug)

  // Routes privées — marque uniquement
  app.get('/brands/me', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) => 
    brandsController.getMyBrand(req, reply)
  )

  app.post('/brands', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) => 
    brandsController.createBrand(req as any, reply)
  )

  app.patch('/brands/me', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) => 
    brandsController.updateBrand(req as any, reply)
  )
}