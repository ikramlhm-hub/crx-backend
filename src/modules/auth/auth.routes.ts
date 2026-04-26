import { FastifyInstance } from 'fastify'
import { authController } from './auth.controller'
import { registerSchema, loginSchema } from './auth.schemas'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          role: { type: 'string', enum: ['CONSUMER', 'BRAND'] }
        }
      }
    }
  }, authController.register)

  app.post('/auth/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      }
    }
  }, authController.login)

  app.post('/auth/logout', authController.logout)
  app.post('/auth/refresh', authController.refresh)
}