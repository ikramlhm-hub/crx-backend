import { FastifyRequest, FastifyReply } from 'fastify'
import { newsletterService } from './newsletter.service'

export const newsletterController = {

  async subscribe(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await newsletterService.subscribe(req.user.userId)
      return reply.status(200).send({
        success: true,
        message: 'Inscription à la newsletter réussie',
        data: user
      })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async unsubscribe(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await newsletterService.unsubscribe(req.user.userId)
      return reply.status(200).send({
        success: true,
        message: 'Désinscription réussie',
        data: user
      })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}