import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../src/app'
import { prisma } from '../src/lib/prisma'

const app = buildApp()

describe('Products module', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  it('returns the list of active products', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    })

    expect(response.statusCode).toBe(200)

    const body = response.json()

    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  it('returns one product by id', async () => {
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        brand: {
          isActive: true,
        },
      },
    })

    expect(product).not.toBeNull()

    const response = await app.inject({
      method: 'GET',
      url: `/api/products/${product!.id}`,
    })

    expect(response.statusCode).toBe(200)

    const body = response.json()

    expect(body.success).toBe(true)
    expect(body.data.id).toBe(product!.id)
    expect(body.data.name).toBe(product!.name)
  })

  it('returns 404 for an unknown product', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products/unknown-product-id',
    })

    expect(response.statusCode).toBe(404)

    const body = response.json()

    expect(body.success).toBe(false)
  })
})