import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

const app = buildApp()

describe('Auth module', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  it('creates a consumer account', async () => {
    const email = `consumer-${Date.now()}@crx.fr`

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email,
        password: 'password123',
        role: 'CONSUMER',
      },
    })

    expect(response.statusCode).toBe(201)

    const body = response.json()

    expect(body.success).toBe(true)
    expect(body.data.email).toBe(email)
    expect(body.data.role).toBe('CONSUMER')
  })

  it('creates a brand account with an associated brand profile', async () => {
    const email = `brand-${Date.now()}@crx.fr`

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email,
        password: 'password123',
        role: 'BRAND',
      },
    })

    expect(response.statusCode).toBe(201)

    const body = response.json()

    expect(body.success).toBe(true)
    expect(body.data.email).toBe(email)
    expect(body.data.role).toBe('BRAND')

    const brand = await prisma.brand.findUnique({
      where: {
        userId: body.data.id,
      },
    })

    expect(brand).not.toBeNull()
    expect(brand?.userId).toBe(body.data.id)
  })

  it('logs in with valid credentials', async () => {
    const email = `login-${Date.now()}@crx.fr`
    const password = 'password123'

    await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        email,
        password,
        role: 'CONSUMER',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email,
        password,
      },
    })

    expect(response.statusCode).toBe(200)

    const body = response.json()

    expect(body.success).toBe(true)
    expect(body.data.accessToken).toBeDefined()
    expect(body.data.refreshToken).toBeDefined()
    expect(body.data.user.email).toBe(email)
  })

  it('rejects login with invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'unknown-user@crx.fr',
        password: 'wrongpassword',
      },
    })

    expect(response.statusCode).toBe(401)

    const body = response.json()

    expect(body.success).toBe(false)
  })
})