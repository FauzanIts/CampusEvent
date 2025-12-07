// start/routes.ts
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { message: 'CampusEvent API' }
})

// Auth routes (public)
Route.post('/auth/register', 'AuthController.register')
Route.post('/auth/login', 'AuthController.login')

// Events routes (protected with JWT)
Route.group(() => {
  Route.get('/events', 'EventsController.index')
  Route.post('/events', 'EventsController.store')
  Route.get('/events/:id', 'EventsController.show')
  Route.put('/events/:id', 'EventsController.update')
  Route.get('/events/:id/weather', 'EventsController.weather')
  
  // Delete also requires API key
  Route.delete('/events/:id', 'EventsController.destroy').middleware('apiKey')
}).middleware('authJwt')
