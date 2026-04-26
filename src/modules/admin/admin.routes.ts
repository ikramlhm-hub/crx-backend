import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { adminController } from './admin.controller'
import { authenticate } from '../../middlewares/authenticate'
import { authorize } from '../../middlewares/authorize'

export async function adminRoutes(app: FastifyInstance) {

  const adminGuard = { preHandler: [authenticate, authorize('ADMIN')] }

  // Dashboard
  app.get('/admin/stats', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.getDashboardStats(req, reply)
  )

  // Marques
  app.get('/admin/brands', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.getAllBrands(req, reply)
  )

  app.patch('/admin/brands/:id/approve', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.approveBrand(req, reply)
  )

  app.patch('/admin/brands/:id/reject', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.rejectBrand(req, reply)
  )

  app.post('/admin/brands/:id/credits', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.addCredits(req, reply)
  )

  // Services
  app.get('/admin/services', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.getAllServiceRequests(req, reply)
  )

  app.patch('/admin/services/:id/approve', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.approveService(req, reply)
  )

  app.patch('/admin/services/:id/reject', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.rejectService(req, reply)
  )

  app.patch('/admin/services/:id/complete', adminGuard,
    (req: FastifyRequest, reply: FastifyReply) =>
      adminController.completeService(req, reply)
  )
}