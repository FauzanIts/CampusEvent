import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { UserModel } from 'App/Models/Mongo/User'
import { ensureMongoConnected } from 'App/Services/MongoConnection'

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
export default class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Register new user
   *     description: Membuat user baru dengan email, password, dan name. Akan generate JWT token dan API key.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: password123
   *                 minLength: 6
   *     responses:
   *       201:
   *         description: User berhasil didaftarkan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User registered
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Email sudah terdaftar atau input tidak valid
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public async register({ request, response }: HttpContextContract) {
    await ensureMongoConnected()

    const { name, email, password } = request.only(['name', 'email', 'password'])

    const exists = await UserModel.findOne({ email })
    if (exists) {
      return response.badRequest({ message: 'Email already used' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const apiKey = randomBytes(16).toString('hex')

    const user = await UserModel.create({
      name,
      email,
      password: hashed,
      role: 'user',
      apiKey,
    })

    return response.created({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        apiKey: user.apiKey,
      },
    })
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags:
   *       - Authentication
   *     summary: Login user
   *     description: Login dengan email dan password untuk mendapatkan JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: password123
   *     responses:
   *       200:
   *         description: Login berhasil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                   description: JWT token untuk authentication
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Email atau password salah
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public async login({ request, response }: HttpContextContract) {
    await ensureMongoConnected()

    const { email, password } = request.only(['email', 'password'])

    const user = await UserModel.findOne({ email })
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const secret = Env.get('JWT_SECRET', 'campusevent-secret-key')

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: '1d',
    })

    return response.ok({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        apiKey: user.apiKey,
      },
    })
  }
}
