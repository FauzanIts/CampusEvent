import Server from '@ioc:Adonis/Core/Server'
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
])

Server.middleware.registerNamed({
  authJwt: () => import('App/Middleware/AuthJwt'),
  apiKey: () => import('App/Middleware/ApiKey'),
})