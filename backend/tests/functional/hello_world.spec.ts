import { test } from '@japa/runner'

/**
 * Test Case 0: API Root Endpoint
 * Memastikan API server berjalan dan root endpoint mengembalikan response yang benar
 */
test('should return API welcome message', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertBodyContains({ message: 'CampusEvent API' })
})
