// app/Controllers/Http/EventsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EventModel } from '../../Models/Mongo/Event'
import { GeocodingService } from '../../Services/GeocodingService'
import { WeatherService } from '../../Services/WeatherService'
import { ensureMongoConnected } from '../../Services/MongoConnection'

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */
export default class EventsController {
  /**
   * @swagger
   * /events:
   *   get:
   *     tags:
   *       - Events
   *     summary: Get all events
   *     description: Mendapatkan list semua event, diurutkan berdasarkan tanggal
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List events berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Event'
   *       401:
   *         description: Unauthorized - Token tidak valid
   *       500:
   *         description: Internal server error
   */
  public async index({ response }: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const events = await EventModel.find().sort({ date: 1 })
      return response.ok(events)
    } catch (error) {
      console.error('INDEX ERROR:', error)
      return response.internalServerError({ message: 'Failed to fetch events', error: error.message })
    }
  }

  /**
   * @swagger
   * /events:
   *   post:
   *     tags:
   *       - Events
   *     summary: Create new event
   *     description: Membuat event baru dengan automatic geocoding (jika API key tersedia)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - date
   *               - location
   *             properties:
   *               title:
   *                 type: string
   *                 example: Seminar Teknologi AI
   *               description:
   *                 type: string
   *                 example: Seminar tentang perkembangan AI dan Machine Learning
   *               date:
   *                 type: string
   *                 format: date
   *                 example: 2025-12-15
   *               location:
   *                 type: string
   *                 example: Jakarta
   *     responses:
   *       201:
   *         description: Event berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       400:
   *         description: Missing required fields
   *       401:
   *         description: Unauthorized - Token tidak valid
   *       500:
   *         description: Internal server error
   */
  public async store(ctx: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const events = await EventModel.find().sort({ date: 1 })
      return response.ok(events)
    } catch (error) {
      console.error('INDEX ERROR:', error)
      return response.internalServerError({ message: 'Failed to fetch events', error: error.message })
    }
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx
    const user = (ctx as any).user

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    try {
      const { title, description, date, location } = request.only([
        'title',
        'description',
        'date',
        'location',
      ])

      // Validate required fields
      if (!title || !description || !date || !location) {
        return response.badRequest({ 
          message: 'Missing required fields', 
          required: ['title', 'description', 'date', 'location'] 
        })
      }

      await ensureMongoConnected()
      console.log('[EventsController.store] Creating event:', { title, location })

      // Try geocoding but don't fail if it doesn't work
      let geo = null
      try {
        geo = await GeocodingService.geocode(location)
      } catch (geoError) {
        console.error('[EventsController.store] Geocoding failed:', geoError.message)
        // Continue without geocoding
      }

      console.log('[EventsController.store] Geocoding result:', geo)
      console.log('[EventsController.store] User ID:', user.id || user._id)

      const event = await EventModel.create({
        title,
        description,
        date,
        location,
        latitude: geo?.lat,
        longitude: geo?.lng,
        createdBy: user.id || user._id,
      })

      console.log('[EventsController.store] ✅ Event created successfully:', event._id)
      return response.created(event)
    } catch (error) {
      console.error('[STORE EVENT ERROR]:', error)
      console.error('[STORE EVENT ERROR] Stack:', error.stack)
      return response.internalServerError({ 
        message: 'Failed to create event', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  }

  /**
   * @swagger
   * /events/{id}:
   *   get:
   *     tags:
   *       - Events
   *     summary: Get event by ID
   *     description: Mendapatkan detail event berdasarkan ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *         example: 507f1f77bcf86cd799439011
   *     responses:
   *       200:
   *         description: Event detail
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       404:
   *         description: Event not found
   *       401:
   *         description: Unauthorized
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const event = await EventModel.findById(params.id)
      if (!event) return response.notFound({ message: 'Event not found' })
      return response.ok(event)
    } catch (error) {
      console.error('SHOW ERROR:', error)
      return response.internalServerError({ message: 'Failed to fetch event', error: error.message })
    }
  }

  /**
   * @swagger
   * /events/{id}:
   *   put:
   *     tags:
   *       - Events
   *     summary: Update event
   *     description: Update event data (semua field optional)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date
   *               location:
   *                 type: string
   *     responses:
   *       200:
   *         description: Event berhasil diupdate
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       404:
   *         description: Event not found
   *       401:
   *         description: Unauthorized
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const event = await EventModel.findById(params.id)
      if (!event) return response.notFound({ message: 'Event not found' })

      const { title, description, date, location } = request.only([
        'title',
        'description',
        'date',
        'location',
      ])

      if (title !== undefined) event.title = title
      if (description !== undefined) event.description = description
      if (date !== undefined) event.date = date
      if (location !== undefined) {
        event.location = location
        const geo = await GeocodingService.geocode(location)
        event.latitude = geo?.lat
        event.longitude = geo?.lng
      }

      await event.save()
      return response.ok(event)
    } catch (error) {
      console.error('UPDATE ERROR:', error)
      return response.internalServerError({ message: 'Failed to update event', error: error.message })
    }
  }

  /**
   * @swagger
   * /events/{id}:
   *   delete:
   *     tags:
   *       - Events
   *     summary: Delete event
   *     description: Hapus event (memerlukan JWT token dan API key)
   *     security:
   *       - bearerAuth: []
   *       - apiKey: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Event berhasil dihapus
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Event deleted
   *       404:
   *         description: Event not found
   *       401:
   *         description: Unauthorized - Token atau API key tidak valid
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const event = await EventModel.findById(params.id)
      if (!event) return response.notFound({ message: 'Event not found' })

      await event.deleteOne()
      return response.ok({ message: 'Event deleted' })
    } catch (error) {
      console.error('DESTROY ERROR:', error)
      return response.internalServerError({ message: 'Failed to delete event', error: error.message })
    }
  }

  /**
   * @swagger
   * /events/{id}/weather:
   *   get:
   *     tags:
   *       - Integration
   *     summary: Get weather for event location
   *     description: Mendapatkan informasi cuaca untuk lokasi event menggunakan OpenWeather API. Event harus memiliki coordinates (latitude & longitude).
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Weather information berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 eventId:
   *                   type: string
   *                 location:
   *                   type: string
   *                 weather:
   *                   type: object
   *                   properties:
   *                     temperature:
   *                       type: number
   *                       example: 28.5
   *                     description:
   *                       type: string
   *                       example: Clear sky
   *                     humidity:
   *                       type: number
   *                       example: 65
   *       400:
   *         description: Event tidak memiliki coordinates
   *       404:
   *         description: Event not found
   *       401:
   *         description: Unauthorized
   */
  public async weather({ params, response }: HttpContextContract) {
    try {
      await ensureMongoConnected()
      const event = await EventModel.findById(params.id)
      if (!event) return response.notFound({ message: 'Event not found' })

      if (!event.latitude || !event.longitude) {
        return response.badRequest({ message: 'Event has no coordinates' })
      }

      const weather = await WeatherService.getWeather(event.latitude, event.longitude)
      event.weatherInfo = weather
      await event.save()

      return response.ok({
        eventId: event.id,
        location: event.location,
        weather,
      })
    } catch (error) {
      console.error('WEATHER ERROR:', error)
      return response.internalServerError({ message: 'Failed to fetch weather', error: error.message })
    }
  }
}
