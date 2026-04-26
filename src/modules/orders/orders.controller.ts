import { FastifyRequest, FastifyReply } from 'fastify'
import { ordersService } from './orders.service'

export const ordersController = {

  async createOrder(req: FastifyRequest, reply: FastifyReply) {
    try {
      const order = await ordersService.createOrder(
        req.user.userId,
        req.body as any
      )
      return reply.status(201).send({ success: true, data: order })
    } catch (err: any) {
      if (err.message === 'PRODUCT_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Produit introuvable' })
      }
      if (err.message === 'INSUFFICIENT_STOCK') {
        return reply.status(400).send({ success: false, message: 'Stock insuffisant' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getMyOrders(req: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await ordersService.getMyOrders(req.user.userId)
      return reply.status(200).send({ success: true, data: orders })
    } catch {
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getOrderById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
      const order = await ordersService.getOrderById(req.user.userId, id)
      return reply.status(200).send({ success: true, data: order })
    } catch (err: any) {
      if (err.message === 'ORDER_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Commande introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async getBrandOrders(req: FastifyRequest, reply: FastifyReply) {
    try {
      const orders = await ordersService.getBrandOrders(req.user.userId)
      return reply.status(200).send({ success: true, data: orders })
    } catch (err: any) {
      if (err.message === 'BRAND_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Marque introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  },

  async updateOrderStatus(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string }
    const { status } = req.body as any
    try {
      const order = await ordersService.updateOrderStatus(id, status)
      return reply.status(200).send({ success: true, data: order })
    } catch (err: any) {
      if (err.message === 'ORDER_NOT_FOUND') {
        return reply.status(404).send({ success: false, message: 'Commande introuvable' })
      }
      return reply.status(500).send({ success: false, message: 'Erreur serveur' })
    }
  }
}