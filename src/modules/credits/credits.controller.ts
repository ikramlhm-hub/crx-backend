import { FastifyRequest, FastifyReply } from 'fastify'
import { creditsService } from './credits.service'

export const creditsController = {

  async getCredits(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await creditsService.getCredits(req.user.userId)
      return reply.status(200).send({ success: true, data })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async requestService(req: FastifyRequest, reply: FastifyReply) {
    try {
      const service = await creditsService.requestService(
        req.user.userId,
        req.body as any
      )
      return reply.status(201).send({ success: true, data: service })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      if (err.message === 'INSUFFICIENT_CREDITS') {
        return reply.status(400).send({ success: false, message: 'Crédits insuffisants' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getMyServices(req: FastifyRequest, reply: FastifyReply) {
    try {
      const services = await creditsService.getMyServices(req.user.userId)
      return reply.status(200).send({ success: true, data: services })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getServiceCosts(req: FastifyRequest, reply: FastifyReply) {
    const costs = await creditsService.getServiceCosts()
    return reply.status(200).send({ success: true, data: costs })
  }
}