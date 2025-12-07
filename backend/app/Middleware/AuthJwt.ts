import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import { UserModel } from 'App/Models/Mongo/User'
import { ensureMongoConnected } from 'App/Services/MongoConnection'

export default class AuthJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    try {
      const authHeader =
        request.header('authorization') || request.header('Authorization')

      console.log('[AuthJwt] Headers:', {
        authorization: authHeader,
        allHeaders: request.headers(),
      })

      if (!authHeader) {
        console.log('[AuthJwt] ERROR: No authorization header')
        return response.unauthorized({ message: 'Missing authorization header' })
      }

      const parts = authHeader.split(' ')
      
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.log('[AuthJwt] ERROR: Invalid format:', parts)
        return response.unauthorized({ message: 'Invalid authorization format. Use: Bearer <token>' })
      }

      const token = parts[1]

      if (!token || token.trim() === '') {
        console.log('[AuthJwt] ERROR: Token is empty')
        return response.unauthorized({ message: 'Token is empty' })
      }

      const secret = Env.get('JWT_SECRET')
      console.log('[AuthJwt] JWT_SECRET exists:', !!secret)
      
      if (!secret) {
        console.error('[AuthJwt] JWT_SECRET is not defined in environment')
        return response.internalServerError({ message: 'Server configuration error' })
      }

      const payload = jwt.verify(token, secret) as { userId: string }
      console.log('[AuthJwt] Token verified, payload:', payload)

      if (!payload.userId) {
        console.log('[AuthJwt] ERROR: No userId in payload')
        return response.unauthorized({ message: 'Invalid token payload' })
      }

      await ensureMongoConnected()
      const user = await UserModel.findById(payload.userId)
      console.log('[AuthJwt] User found:', !!user, user ? user.email : 'null')

      if (!user) {
        console.log('[AuthJwt] ERROR: User not found in DB')
        return response.unauthorized({ message: 'User not found or token invalid' })
      }

      // simpan user di ctx, biar bisa diakses di EventsController
      ;(ctx as any).user = user
      console.log('[AuthJwt] ✅ Authentication successful for user:', user.email)

      await next()
    } catch (error) {
      console.error('[AuthJwt] EXCEPTION:', error.name, error.message)
      
      if (error.name === 'TokenExpiredError') {
        return response.unauthorized({ message: 'Token has expired. Please login again' })
      }
      
      if (error.name === 'JsonWebTokenError') {
        return response.unauthorized({ message: 'Invalid token signature' })
      }
      
      return response.unauthorized({ message: 'Authentication failed' })
    }
  }
}
