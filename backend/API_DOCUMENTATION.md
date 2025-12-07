# CampusEvent API Documentation

## 🚀 Base URL
```
Development: http://localhost:3333
```

## 📚 Swagger UI
Akses dokumentasi interaktif Swagger UI di:
```
http://localhost:3333/docs
```

## 🔐 Authentication

API menggunakan **JWT (JSON Web Token)** untuk authentication.

### Cara Menggunakan:
1. Register atau Login untuk mendapatkan token
2. Gunakan token di header: `Authorization: Bearer <token>`
3. Untuk operasi DELETE, tambahkan API Key: `x-api-key: <apiKey>`

---

## 📝 Endpoints

### **Authentication**

#### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "apiKey": "abc123def456ghi789"
  }
}
```

**Notes:**
- Password akan di-hash menggunakan bcrypt
- API Key akan di-generate otomatis untuk operasi delete

---

#### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "apiKey": "abc123def456ghi789"
  }
}
```

**Notes:**
- Token berlaku selama 1 hari
- Simpan token untuk digunakan di request berikutnya

---

### **Events Management**

#### 3. Get All Events
**GET** `/events`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Seminar Teknologi AI",
    "description": "Seminar tentang perkembangan AI",
    "date": "2025-12-15T10:00:00.000Z",
    "location": "Jakarta",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "weatherInfo": null,
    "createdBy": "507f1f77bcf86cd799439012",
    "createdAt": "2025-12-07T04:00:00.000Z",
    "updatedAt": "2025-12-07T04:00:00.000Z"
  }
]
```

**Notes:**
- Events diurutkan berdasarkan tanggal (ascending)
- Memerlukan JWT token

---

#### 4. Create Event
**POST** `/events`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Seminar Teknologi AI",
  "description": "Seminar tentang perkembangan AI dan Machine Learning",
  "date": "2025-12-15",
  "location": "Jakarta"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Seminar Teknologi AI",
  "description": "Seminar tentang perkembangan AI dan Machine Learning",
  "date": "2025-12-15T00:00:00.000Z",
  "location": "Jakarta",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2025-12-07T04:00:00.000Z",
  "updatedAt": "2025-12-07T04:00:00.000Z"
}
```

**Notes:**
- Latitude & longitude akan di-set otomatis via Geocoding API (jika tersedia)
- Jika Geocoding gagal, event tetap dibuat tanpa coordinates
- Field `title`, `description`, `date`, `location` wajib diisi

---

#### 5. Get Event by ID
**GET** `/events/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Seminar Teknologi AI",
  "description": "Seminar tentang perkembangan AI",
  "date": "2025-12-15T10:00:00.000Z",
  "location": "Jakarta",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "createdBy": "507f1f77bcf86cd799439012"
}
```

---

#### 6. Update Event
**PUT** `/events/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (semua field optional)
```json
{
  "title": "Seminar AI - Updated",
  "description": "Updated description",
  "date": "2025-12-20",
  "location": "Bandung"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Seminar AI - Updated",
  "description": "Updated description",
  "date": "2025-12-20T00:00:00.000Z",
  "location": "Bandung",
  "latitude": -6.9175,
  "longitude": 107.6191,
  "updatedAt": "2025-12-07T05:00:00.000Z"
}
```

**Notes:**
- Jika location diubah, coordinates akan di-update otomatis

---

#### 7. Delete Event
**DELETE** `/events/:id`

**Headers:**
```
Authorization: Bearer <token>
x-api-key: <apiKey>
```

**Response (200):**
```json
{
  "message": "Event deleted"
}
```

**Notes:**
- **Memerlukan 2 authentication**: JWT token DAN API key
- API key didapatkan saat register/login (dari response user.apiKey)

---

### **Integration - Weather API**

#### 8. Get Weather for Event
**GET** `/events/:id/weather`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "eventId": "507f1f77bcf86cd799439011",
  "location": "Jakarta",
  "weather": {
    "temperature": 28.5,
    "description": "Clear sky",
    "humidity": 65,
    "pressure": 1012,
    "wind_speed": 3.5
  }
}
```

**Notes:**
- Event harus memiliki coordinates (latitude & longitude)
- Menggunakan OpenWeather API
- Weather info akan disimpan di field `weatherInfo` di event document

---

## 🔒 Security Features

### 1. JWT Authentication
- Semua endpoints `/events/*` memerlukan JWT token
- Token berlaku selama 1 hari
- Format: `Authorization: Bearer <token>`

### 2. API Key (Additional Security)
- DELETE operation memerlukan API key tambahan
- API key di-generate saat register
- Format: `x-api-key: <apiKey>`

### 3. Password Hashing
- Password di-hash menggunakan bcrypt dengan salt rounds 10
- Password tidak pernah disimpan dalam plain text

---

## 🌍 External API Integration

### 1. OpenWeather API
- **Purpose**: Mendapatkan informasi cuaca untuk lokasi event
- **Endpoint**: `/events/:id/weather`
- **Provider**: OpenWeatherMap
- **Configuration**: `OPENWEATHER_API_KEY` di `.env`

### 2. Geocoding API (OpenCage/Google Maps)
- **Purpose**: Convert location name menjadi coordinates (lat/lng)
- **Usage**: Otomatis dipanggil saat create/update event
- **Provider**: OpenCage Geocoder API
- **Configuration**: `GEOCODING_API_KEY` di `.env`
- **Fallback**: Jika API gagal, event tetap dibuat tanpa coordinates

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Missing required fields",
  "required": ["title", "description", "date", "location"]
}
```

### 401 Unauthorized
```json
{
  "message": "Token has expired. Please login again"
}
```

### 404 Not Found
```json
{
  "message": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to create event",
  "error": "Error details",
  "details": "Stack trace (development only)"
}
```

---

## 🧪 Testing dengan Swagger UI

1. Buka browser: `http://localhost:3333/docs`
2. Klik **Authorize** di pojok kanan atas
3. Register user baru di `/auth/register`
4. Login di `/auth/login` untuk mendapatkan token
5. Copy token dari response
6. Paste token di dialog Authorization (format: `Bearer <token>`)
7. Klik **Authorize**
8. Sekarang Anda bisa test semua endpoints

---

## 📊 Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  apiKey: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```typescript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  date: Date (required),
  location: String (required),
  latitude: Number (optional),
  longitude: Number (optional),
  weatherInfo: Object (optional),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3333
MONGO_URI="your-mongodb-uri"
JWT_SECRET="your-secret-key"
OPENWEATHER_API_KEY="your-openweather-key"
GEOCODING_API_KEY="your-geocoding-key"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Server
```bash
npm run dev
```

### 4. Access Swagger Docs
```
http://localhost:3333/docs
```

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan contact API support team.
