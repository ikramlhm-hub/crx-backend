import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import { RegisterInput, LoginInput } from './auth.schemas'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'

export const authService = {

  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return user
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const isValid = await bcrypt.compare(data.password, user.password)

    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' as any }
    )

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt
      }
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })
  },

  async refresh(refreshToken: string) {
    const existing = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!existing || existing.expiresAt < new Date()) {
      throw new Error('INVALID_REFRESH_TOKEN')
    }

    const accessToken = jwt.sign(
      { userId: existing.user.id, role: existing.user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    return { accessToken }
  }
}