// app/Middleware/ApiKey.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserModel } from '../Models/Mongo/User'
import { ensureMongoConnected } from '../Services/MongoConnection'

export default class ApiKey {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // API key boleh lewat header x-api-key ATAU query ?token=
    const apiKey = request.header('x-api-key') || request.input('token')

    if (!apiKey) {
      return response.unauthorized({ message: 'API key required' })
    }

    await ensureMongoConnected()
    const user = await UserModel.findOne({ apiKey })

    if (!user) {
      return response.unauthorized({ message: 'Invalid token' })
    }

    ;(request as any).apiUser = user

    await next()
  }
}
