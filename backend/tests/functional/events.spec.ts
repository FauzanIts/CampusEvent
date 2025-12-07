import { test } from '@japa/runner'

/**
 * Helper function: Create authenticated user dan return token + apiKey
 */
async function createAuthenticatedUser(client: any) {
  const testEmail = `eventtest${Date.now()}@example.com`

  // Register user
  const registerResponse = await client
    .post('/auth/register')
    .json({
      name: 'Event Test User',
      email: testEmail,
      password: 'password123'
    })

  const apiKey = registerResponse.body().user.apiKey

  // Login to get token
  const loginResponse = await client
    .post('/auth/login')
    .json({
      email: testEmail,
      password: 'password123'
    })

  const token = loginResponse.body().token

  return { token, apiKey, email: testEmail }
}

test.group('Events', () => {

  /**
   * Test Case 6: Create Event - Success
   * Memastikan user dapat membuat event baru dengan data yang valid
   */
  test('should create new event successfully', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser(client)
    
    const eventData = {
      title: 'Seminar Teknologi',
      description: 'Seminar tentang AI dan Machine Learning',
      date: '2025-12-15',
      location: 'Jakarta'
    }

    const response = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json(eventData)

    response.assertStatus(201)
    
    const body = response.body()
    assert.exists(body._id)
    assert.equal(body.title, eventData.title)
    assert.equal(body.description, eventData.description)
    assert.equal(body.location, eventData.location)
    assert.exists(body.createdBy)
  })

  /**
   * Test Case 7: Create Event - Missing Required Fields
   * Memastikan system menolak pembuatan event tanpa field yang wajib
   */
  test('should not create event with missing fields', async ({ client }) => {
    const { token } = await createAuthenticatedUser(client)
    
    const incompleteData = {
      title: 'Incomplete Event'
      // Missing: description, date, location
    }

    const response = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json(incompleteData)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Missing required fields' })
  })

  /**
   * Test Case 8: Create Event - Unauthorized (No Token)
   * Memastikan endpoint memerlukan authentication
   */
  test('should not create event without authentication', async ({ client }) => {
    const eventData = {
      title: 'Unauthorized Event',
      description: 'This should fail',
      date: '2025-12-15',
      location: 'Jakarta'
    }

    const response = await client.post('/events').json(eventData)

    response.assertStatus(401)
  })

  /**
   * Test Case 9: Get All Events - Success
   * Memastikan user dapat mengambil list semua events
   */
  test('should get all events successfully', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser(client)
    
    const response = await client
      .get('/events')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    
    const body = response.body()
    assert.isArray(body)
    
    if (body.length > 0) {
      assert.exists(body[0]._id)
      assert.exists(body[0].title)
      assert.exists(body[0].location)
    }
  })

  /**
   * Test Case 10: Get Event by ID - Success
   * Memastikan user dapat mengambil detail event berdasarkan ID
   */
  test('should get event by ID successfully', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser(client)
    
    // Buat event baru untuk test ini
    const createResponse = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Event for Get Test',
        description: 'Test description',
        date: '2025-12-20',
        location: 'Bandung'
      })

    const createdEventId = createResponse.body()._id

    // Get event by ID
    const response = await client
      .get(`/events/${createdEventId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    
    const body = response.body()
    assert.equal(body._id, createdEventId)
    assert.equal(body.title, 'Event for Get Test')
  })

  /**
   * Test Case 11: Get Event by ID - Not Found
   * Memastikan system mengembalikan 404 untuk event yang tidak ada
   */
  test('should return 404 for non-existent event', async ({ client }) => {
    const { token } = await createAuthenticatedUser(client)
    
    const fakeId = '507f1f77bcf86cd799439011' // Valid MongoDB ObjectId format

    const response = await client
      .get(`/events/${fakeId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    response.assertBodyContains({ message: 'Event not found' })
  })

  /**
   * Test Case 12: Update Event - Success
   * Memastikan user dapat mengupdate event yang ada
   */
  test('should update event successfully', async ({ client, assert }) => {
    const { token } = await createAuthenticatedUser(client)
    
    // Buat event baru untuk test update
    const createResponse = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Event to Update',
        description: 'Original description',
        date: '2025-12-25',
        location: 'Surabaya'
      })

    const eventToUpdateId = createResponse.body()._id

    // Update event
    const updateData = {
      title: 'Updated Event Title',
      description: 'Updated description'
    }

    const response = await client
      .put(`/events/${eventToUpdateId}`)
      .header('Authorization', `Bearer ${token}`)
      .json(updateData)

    response.assertStatus(200)
    
    const body = response.body()
    assert.equal(body.title, updateData.title)
    assert.equal(body.description, updateData.description)
    assert.equal(body.location, 'Surabaya') // Location tidak berubah
  })

  /**
   * Test Case 13: Delete Event - Success
   * Memastikan user dapat menghapus event dengan JWT token dan API key
   */
  test('should delete event successfully with JWT and API key', async ({ client }) => {
    const { token, apiKey } = await createAuthenticatedUser(client)
    
    // Buat event baru untuk test delete
    const createResponse = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Event to Delete',
        description: 'This will be deleted',
        date: '2025-12-30',
        location: 'Medan'
      })

    const eventToDeleteId = createResponse.body()._id

    // Delete event dengan JWT + API Key
    const response = await client
      .delete(`/events/${eventToDeleteId}`)
      .header('Authorization', `Bearer ${token}`)
      .header('x-api-key', apiKey)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Event deleted' })

    // Verify event sudah terhapus
    const getResponse = await client
      .get(`/events/${eventToDeleteId}`)
      .header('Authorization', `Bearer ${token}`)

    getResponse.assertStatus(404)
  })

  /**
   * Test Case 14: Delete Event - Unauthorized (No API Key)
   * Memastikan delete memerlukan API key tambahan
   */
  test('should not delete event without API key', async ({ client }) => {
    const { token } = await createAuthenticatedUser(client)
    
    // Buat event baru
    const createResponse = await client
      .post('/events')
      .header('Authorization', `Bearer ${token}`)
      .json({
        title: 'Event for API Key Test',
        description: 'Test description',
        date: '2025-12-31',
        location: 'Yogyakarta'
      })

    const eventToDeleteId = createResponse.body()._id

    // Coba delete hanya dengan JWT (tanpa API Key)
    const response = await client
      .delete(`/events/${eventToDeleteId}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(401)
  })
})
