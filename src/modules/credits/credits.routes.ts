import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { creditsController } from './credits.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function creditsRoutes(app: FastifyInstance) {

  // Publique — voir les coûts des services
  app.get('/credits/services/costs',
    creditsController.getServiceCosts
  )

  // Privées — marque uniquement
  app.get('/credits/me', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    creditsController.getCredits(req, reply)
  )

  app.get('/credits/me/services', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    creditsController.getMyServices(req, reply)
  )

  app.post('/credits/me/services', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    creditsController.requestService(req, reply)
  )
}