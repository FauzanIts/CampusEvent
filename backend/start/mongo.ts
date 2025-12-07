// start/mongo.ts
import mongoose from 'mongoose'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export async function connectMongo() {
  const uri = Env.get('MONGO_URI')

  Logger.info('⏳ Connecting to MongoDB...')

  try {
    await mongoose.connect(uri)
    Logger.info('✅ MongoDB connected')
  } catch (error) {
    Logger.error('❌ MongoDB connection error: %o', error)
  }
}
