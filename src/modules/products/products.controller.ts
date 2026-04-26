import { FastifyRequest, FastifyReply } from 'fastify'
import { productsService } from './products.service'

export const productsController = {

  async createProduct(req: FastifyRequest, reply: FastifyReply) {
    try {
      const product = await productsService.createProduct(
        req.user.userId,
        req.body as any
      )
      return reply.status(201).send({ success: true, data: product })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getMyProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await productsService.getMyProducts(req.user.userId)
      return reply.status(200).send({ success: true, data: products })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async updateProduct(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const product = await productsService.updateProduct(
        req.user.userId,
        id,
        req.body as any
      )
      return reply.status(200).send({ success: true, data: product })
    } catch (err: any) {
      if (err.message === 'PRODUCT_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Produit introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async deleteProduct(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      await productsService.deleteProduct(req.user.userId, id)
      return reply.status(200).send({ success: true, message: 'Produit supprimé' })
    } catch (err: any) {
      if (err.message === 'PRODUCT_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Produit introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getAllProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const query = req.query as any
      const products = await productsService.getAllProducts({
        minPrice: query.minPrice ? Number(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined
      })
      return reply.status(200).send({ success: true, data: products })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getProductById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const product = await productsService.getProductById(id)
      return reply.status(200).send({ success: true, data: product })
    } catch (err: any) {
      if (err.message === 'PRODUCT_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Produit introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}