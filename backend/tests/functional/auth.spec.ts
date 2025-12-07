import { test } from '@japa/runner'

test.group('Authentication', () => {
  /**
   * Test Case 1: Register User - Success
   * Memastikan user baru dapat mendaftar dengan data yang valid
   */
  test('should register new user successfully', async ({ client, assert }) => {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'password123'
    }

    const response = await client.post('/auth/register').json(userData)

    response.assertStatus(201)
    response.assertBodyContains({ message: 'User registered' })
    
    const body = response.body()
    assert.exists(body.user)
    assert.equal(body.user.name, userData.name)
    assert.equal(body.user.email, userData.email)
    assert.exists(body.user.apiKey)
    assert.exists(body.user.id)
  })

  /**
   * Test Case 2: Register User - Email Already Exists
   * Memastikan system menolak registrasi dengan email yang sudah ada
   */
  test('should not register user with duplicate email', async ({ client }) => {
    const userData = {
      name: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123'
    }

    // Register pertama kali
    await client.post('/auth/register').json(userData)

    // Coba register lagi dengan email sama
    const response = await client.post('/auth/register').json(userData)

    response.assertStatus(400)
    response.assertBodyContains({ message: 'Email already used' })
  })

  /**
   * Test Case 3: Login User - Success
   * Memastikan user dapat login dengan credentials yang benar
   */
  test('should login user successfully', async ({ client, assert }) => {
    const userData = {
      name: 'Login Test',
      email: `login${Date.now()}@example.com`,
      password: 'password123'
    }

    // Register user terlebih dahulu
    await client.post('/auth/register').json(userData)

    // Login dengan credentials yang sama
    const response = await client.post('/auth/login').json({
      email: userData.email,
      password: userData.password
    })

    response.assertStatus(200)
    
    const body = response.body()
    assert.exists(body.token)
    assert.exists(body.user)
    assert.equal(body.user.email, userData.email)
  })

  /**
   * Test Case 4: Login User - Invalid Credentials
   * Memastikan system menolak login dengan password salah
   */
  test('should not login with invalid password', async ({ client }) => {
    const userData = {
      name: 'Invalid Test',
      email: `invalid${Date.now()}@example.com`,
      password: 'correctpassword'
    }

    // Register user
    await client.post('/auth/register').json(userData)

    // Login dengan password salah
    const response = await client.post('/auth/login').json({
      email: userData.email,
      password: 'wrongpassword'
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  })

  /**
   * Test Case 5: Login User - Non-existent Email
   * Memastikan system menolak login dengan email yang tidak terdaftar
   */
  test('should not login with non-existent email', async ({ client }) => {
    const response = await client.post('/auth/login').json({
      email: 'nonexistent@example.com',
      password: 'password123'
    })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  })
})
