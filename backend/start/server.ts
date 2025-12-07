// server.ts
import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import { connectMongo } from './start/mongo'

sourceMapSupport.install({ handleUncaughtExceptions: false })

new Ignitor(__dirname)
  .httpServer()
  .start()
  .then(async () => {
    // dipanggil setelah HTTP server start
    await connectMongo()
  })
  .catch((err) => {
    console.error('Error starting server:', err)
  })