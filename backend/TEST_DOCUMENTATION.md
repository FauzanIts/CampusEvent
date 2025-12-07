# Test Documentation - CampusEvent API

## 📊 Test Coverage Summary

Total Test Cases: **17 tests**

### Test Categories:
1. **API Health** - 1 test
2. **Authentication** - 5 tests
3. **Events Management** - 9 tests
4. **External API Integration** - 3 tests

---

## 🧪 Test Cases Detail

### **Category 1: API Health (1 test)**

#### Test 0: API Root Endpoint
- **File**: `hello_world.spec.ts`
- **Purpose**: Verify API server is running
- **Method**: GET `/`
- **Expected**: Status 200 with message "CampusEvent API"

---

### **Category 2: Authentication (5 tests)**

#### Test 1: Register User - Success
- **File**: `auth.spec.ts`
- **Purpose**: Verify user registration with valid data
- **Method**: POST `/auth/register`
- **Input**: name, email, password
- **Expected**: 
  - Status 201
  - User object with id, name, email, apiKey
  - Message "User registered"

#### Test 2: Register User - Duplicate Email
- **File**: `auth.spec.ts`
- **Purpose**: Verify system rejects duplicate email
- **Method**: POST `/auth/register`
- **Input**: Existing email
- **Expected**: 
  - Status 400
  - Message "Email already used"

#### Test 3: Login User - Success
- **File**: `auth.spec.ts`
- **Purpose**: Verify login with correct credentials
- **Method**: POST `/auth/login`
- **Input**: email, password
- **Expected**: 
  - Status 200
  - JWT token
  - User object

#### Test 4: Login User - Invalid Password
- **File**: `auth.spec.ts`
- **Purpose**: Verify system rejects wrong password
- **Method**: POST `/auth/login`
- **Input**: Valid email, wrong password
- **Expected**: 
  - Status 401
  - Message "Invalid credentials"

#### Test 5: Login User - Non-existent Email
- **File**: `auth.spec.ts`
- **Purpose**: Verify system rejects unregistered email
- **Method**: POST `/auth/login`
- **Input**: Unregistered email
- **Expected**: 
  - Status 401
  - Message "Invalid credentials"

---

### **Category 3: Events Management (9 tests)**

#### Test 6: Create Event - Success
- **File**: `events.spec.ts`
- **Purpose**: Verify event creation with valid data
- **Method**: POST `/events`
- **Auth**: JWT required
- **Input**: title, description, date, location
- **Expected**: 
  - Status 201
  - Event object with _id, coordinates (optional)

#### Test 7: Create Event - Missing Fields
- **File**: `events.spec.ts`
- **Purpose**: Verify validation for required fields
- **Method**: POST `/events`
- **Auth**: JWT required
- **Input**: Incomplete data
- **Expected**: 
  - Status 400
  - Message "Missing required fields"

#### Test 8: Create Event - Unauthorized
- **File**: `events.spec.ts`
- **Purpose**: Verify authentication requirement
- **Method**: POST `/events`
- **Auth**: No token
- **Expected**: Status 401

#### Test 9: Get All Events - Success
- **File**: `events.spec.ts`
- **Purpose**: Verify fetching all events
- **Method**: GET `/events`
- **Auth**: JWT required
- **Expected**: 
  - Status 200
  - Array of events

#### Test 10: Get Event by ID - Success
- **File**: `events.spec.ts`
- **Purpose**: Verify fetching single event
- **Method**: GET `/events/:id`
- **Auth**: JWT required
- **Expected**: 
  - Status 200
  - Event object matching ID

#### Test 11: Get Event by ID - Not Found
- **File**: `events.spec.ts`
- **Purpose**: Verify 404 for non-existent event
- **Method**: GET `/events/:id`
- **Auth**: JWT required
- **Input**: Invalid event ID
- **Expected**: 
  - Status 404
  - Message "Event not found"

#### Test 12: Update Event - Success
- **File**: `events.spec.ts`
- **Purpose**: Verify event update functionality
- **Method**: PUT `/events/:id`
- **Auth**: JWT required
- **Input**: Updated fields (partial)
- **Expected**: 
  - Status 200
  - Updated event object

#### Test 13: Delete Event - Success
- **File**: `events.spec.ts`
- **Purpose**: Verify event deletion with JWT + API Key
- **Method**: DELETE `/events/:id`
- **Auth**: JWT + API Key required
- **Expected**: 
  - Status 200
  - Message "Event deleted"
  - Event tidak bisa diakses lagi

#### Test 14: Delete Event - No API Key
- **File**: `events.spec.ts`
- **Purpose**: Verify API Key requirement for delete
- **Method**: DELETE `/events/:id`
- **Auth**: JWT only (no API Key)
- **Expected**: Status 401

---

### **Category 4: External API Integration (3 tests)**

#### Test 15: Geocoding Integration
- **File**: `integration.spec.ts`
- **Purpose**: Verify geocoding service integration
- **Method**: POST `/events`
- **Auth**: JWT required
- **Expected**: 
  - Event created successfully
  - Coordinates added if geocoding API available
  - Event still created if geocoding fails

#### Test 16: Weather API - Success
- **File**: `integration.spec.ts`
- **Purpose**: Verify weather API integration
- **Method**: GET `/events/:id/weather`
- **Auth**: JWT required
- **Prerequisites**: Event must have coordinates
- **Expected**: 
  - Weather information if API configured
  - Test passes even if API not configured

#### Test 17: Weather API - No Coordinates
- **File**: `integration.spec.ts`
- **Purpose**: Verify error handling for events without coordinates
- **Method**: GET `/events/:id/weather`
- **Auth**: JWT required
- **Expected**: 
  - Status 400
  - Message "Event has no coordinates"

---

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
node ace test tests/functional/auth.spec.ts
node ace test tests/functional/events.spec.ts
node ace test tests/functional/integration.spec.ts
```

### Run with Coverage (if configured)
```bash
npm test -- --coverage
```

---

## 📋 Test Results Format

```
PASSED   ✓ API Root Endpoint (5ms)
PASSED   ✓ Authentication > should register new user successfully (120ms)
PASSED   ✓ Authentication > should not register user with duplicate email (85ms)
PASSED   ✓ Authentication > should login user successfully (95ms)
PASSED   ✓ Authentication > should not login with invalid password (90ms)
PASSED   ✓ Authentication > should not login with non-existent email (75ms)
PASSED   ✓ Events > should create new event successfully (150ms)
PASSED   ✓ Events > should not create event with missing fields (80ms)
PASSED   ✓ Events > should not create event without authentication (65ms)
PASSED   ✓ Events > should get all events successfully (100ms)
PASSED   ✓ Events > should get event by ID successfully (110ms)
PASSED   ✓ Events > should return 404 for non-existent event (85ms)
PASSED   ✓ Events > should update event successfully (125ms)
PASSED   ✓ Events > should delete event successfully with JWT and API key (140ms)
PASSED   ✓ Events > should not delete event without API key (95ms)
PASSED   ✓ External API Integration > should create event with or without geocoding (160ms)
PASSED   ✓ External API Integration > should get weather info for event with coordinates (200ms)
PASSED   ✓ External API Integration > should return error for weather request on event without coordinates (180ms)

Tests:   17 passed (17)
Duration: 2.1s
```

---

## 🎯 Test Coverage Goals

### Covered Areas:
✅ Authentication flow (register, login)  
✅ Authorization (JWT tokens)  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Input validation  
✅ Error handling  
✅ Security (API Key for delete)  
✅ External API integration (Geocoding, Weather)  

### Success Criteria:
- All 17 tests must pass
- No uncaught exceptions
- Proper status codes returned
- Response bodies match expectations
- Authentication & authorization working correctly

---

## 🔧 Configuration for Tests

### Environment Variables (.env.test)
```env
PORT=3333
NODE_ENV=testing
MONGO_URI="your-test-mongodb-uri"
JWT_SECRET="test-secret-key"
OPENWEATHER_API_KEY="optional-for-tests"
GEOCODING_API_KEY="optional-for-tests"
```

**Note**: External API keys are optional for tests. Tests will pass even if APIs are not configured.

---

## 📝 Notes

1. **Unique Emails**: Tests use `Date.now()` to generate unique emails
2. **External APIs**: Tests are resilient - akan pass meski API tidak dikonfigurasi
3. **Cleanup**: Tests tidak cleanup database setelah run (bisa ditambahkan teardown)
4. **Order**: Tests bisa dijalankan dalam urutan apapun (independent)
5. **Async**: Semua tests menggunakan async/await untuk operasi database

---

## 🐛 Troubleshooting

### Test Failures Common Issues:

1. **MongoDB Connection**: Pastikan MongoDB running dan MONGO_URI benar
2. **Port Already in Use**: Stop server sebelum run tests
3. **Timeout**: Increase timeout jika koneksi lambat
4. **Token Expired**: Tests menggunakan token fresh setiap run

### Debug Mode:
```bash
DEBUG=api:* npm test
```

---

## ✅ Hasil Testing

Dokumentasi ini mencakup **≥5 test cases** sebagai requirement:
- ✅ Test Case 0-5: Basic functionality (6 tests)
- ✅ Test Case 6-14: Extended coverage (9 tests)  
- ✅ Test Case 15-17: Integration tests (3 tests)

**Total: 17 comprehensive test cases** covering all major API functionality.
