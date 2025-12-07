// app/Services/MongoConnection.ts
import mongoose from 'mongoose'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

let isConnected = false

export async function ensureMongoConnected() {
  if (isConnected) {
    return
  }

  const uri = Env.get('MONGO_URI')
  Logger.info('⏳ Connecting to MongoDB...')

  try {
    await mongoose.connect(uri)
    isConnected = true
    Logger.info('✅ MongoDB connected')
  } catch (error) {
    Logger.error('❌ MongoDB connection error: %o', error)
    throw error
  }
}
