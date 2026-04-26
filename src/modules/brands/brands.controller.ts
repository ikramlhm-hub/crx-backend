import { FastifyRequest, FastifyReply } from 'fastify'
import { brandsService } from './brands.service'

export const brandsController = {

  async getMyBrand(req: FastifyRequest, reply: FastifyReply) {
    try {
      const brand = await brandsService.getMyBrand(req.user.userId)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async createBrand(
    req: FastifyRequest<{ Body: { name: string; description?: string; story?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const brand = await brandsService.createBrand(req.user.userId, req.body)
      return reply.status(201).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_ALREADY_EXISTS') {
        return reply.status(409).send({ success: false, message: 'Vous avez déjà une marque' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async updateBrand(
    req: FastifyRequest<{ Body: { name?: string; description?: string; story?: string; banner?: string; logo?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const brand = await brandsService.updateBrand(req.user.userId, req.body)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getAllBrands(req: FastifyRequest, reply: FastifyReply) {
    try {
      const brands = await brandsService.getAllBrands()
      return reply.status(200).send({ success: true, data: brands })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getBrandBySlug(
    req: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const brand = await brandsService.getBrandBySlug(req.params.slug)
      return reply.status(200).send({ success: true, data: brand })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}