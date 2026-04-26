import { FastifyRequest, FastifyReply } from 'fastify'
import { adminService } from './admin.service'

export const adminController = {

  async getAllBrands(req: FastifyRequest, reply: FastifyReply) {
    try {
      const brands = await adminService.getAllBrands()
      return reply.status(200).send({ success: true, data: brands })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async approveBrand(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const brand = await adminService.approveBrand(id)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async rejectBrand(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const { message } = req.body as any
    try {
      const brand = await adminService.rejectBrand(id, message)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async addCredits(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const { amount, description } = req.body as any
    try {
      const brand = await adminService.addCreditsToBrand(id, amount, description)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getAllServiceRequests(req: FastifyRequest, reply: FastifyReply) {
    try {
      const services = await adminService.getAllServiceRequests()
      return reply.status(200).send({ success: true, data: services })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async approveService(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const service = await adminService.approveService(id)
      return reply.status(200).send({ success: true, data: service })
    } catch (err: any) {
      if (err.message === 'SERVICE_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Service introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async rejectService(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const result = await adminService.rejectService(id)
      return reply.status(200).send({ success: true, data: result })
    } catch (err: any) {
      if (err.message === 'SERVICE_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Service introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async completeService(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const service = await adminService.completeService(id)
      return reply.status(200).send({ success: true, data: service })
    } catch (err: any) {
      if (err.message === 'SERVICE_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Service introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getDashboardStats(req: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await adminService.getDashboardStats()
      return reply.status(200).send({ success: true, data: stats })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}