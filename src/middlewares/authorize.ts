import { FastifyRequest, FastifyReply } from 'fastify'

export function authorize(...roles: ('CONSUMER' | 'BRAND' | 'ADMIN')[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({
        success: false,
        message: 'Non authentifié'
      })
    }

    if (!roles.includes(req.user.role)) {
      return reply.status(403).send({
        success: false,
        message: 'Accès interdit'
      })
    }
  }
}