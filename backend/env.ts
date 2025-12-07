import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  PORT: Env.schema.number(),
  HOST: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  APP_KEY: Env.schema.string(),
  DRIVE_DISK: Env.schema.string(),

  MONGO_URI: Env.schema.string(),
  JWT_SECRET: Env.schema.string(),

  OPENWEATHER_API_KEY: Env.schema.string.optional(),
  GEOCODING_API_KEY: Env.schema.string.optional(),
})
