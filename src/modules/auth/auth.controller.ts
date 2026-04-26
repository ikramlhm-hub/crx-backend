import { FastifyRequest, FastifyReply } from 'fastify'
import { authService } from './auth.service'
import { RegisterInput, LoginInput } from './auth.schemas'

export const authController = {

  async register(req: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    try {
      const user = await authService.register(req.body)
      return reply.status(201).send({ success: true, data: user })
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        return reply.status(409).send({ success: false, message: 'Email déjà utilisé' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    try {
      const result = await authService.login(req.body)
      return reply.status(200).send({ success: true, data: result })
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({ success: false, message: 'Email ou mot de passe incorrect' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async logout(req: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    try {
      await authService.logout(req.body.refreshToken)
      return reply.status(200).send({ success: true, message: 'Déconnecté' })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async refresh(req: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
    try {
      const result = await authService.refresh(req.body.refreshToken)
      return reply.status(200).send({ success: true, data: result })
    } catch (err: any) {
      if (err.message === 'INVALID_REFRESH_TOKEN') {
        return reply.status(401).send({ success: false, message: 'Token invalide ou expiré' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}