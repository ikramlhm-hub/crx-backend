import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { ordersController } from './orders.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function ordersRoutes(app: FastifyInstance) {

  // Consommateur — passer et consulter ses commandes
  app.post('/orders', {
    preHandler: [authenticate, authorize('CONSUMER')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    ordersController.createOrder(req, reply)
  )

  app.get('/orders/me', {
    preHandler: [authenticate, authorize('CONSUMER')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    ordersController.getMyOrders(req, reply)
  )

  app.get('/orders/:id', {
    preHandler: [authenticate, authorize('CONSUMER')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    ordersController.getOrderById(req, reply)
  )

  //Marque: voir les commandes qui la concernent
  app.get('/orders/brand', {
    preHandler: [authenticate, authorize('BRAND')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    ordersController.getBrandOrders(req, reply)
  )

  //Admin: mettre à jour le statut d'une commande
  app.patch('/orders/:id/status', {
    preHandler: [authenticate, authorize('ADMIN')]
  }, (req: FastifyRequest, reply: FastifyReply) =>
    ordersController.updateOrderStatus(req, reply)
  )
}