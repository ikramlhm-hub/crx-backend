import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { newsletterController } from './newsletter.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function newsletterRoutes(app: FastifyInstance) {

  app.post('/newsletter/subscribe', {
    preHandler: [authenticate, authorize('CONSUMER')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    newsletterController.subscribe(req, reply)
  )

  app.post('/newsletter/unsubscribe', {
    preHandler: [authenticate, authorize('CONSUMER')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    newsletterController.unsubscribe(req, reply)
  )
}