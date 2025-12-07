# 🚀 Deploy CampusEvent API ke Vercel

## Langkah-langkah Deploy:

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

Pilih metode login (GitHub/Email).

### 3. Deploy dari Terminal

```bash
cd C:\Project_S3\API\campusevent\backend
vercel
```

Jawab pertanyaan:
- Set up and deploy? **Y**
- Which scope? **Pilih akun Anda**
- Link to existing project? **N**
- What's your project's name? **campusevent-api**
- In which directory is your code located? **./backend** atau **./**
- Want to override settings? **N**

### 4. Production Deploy

```bash
vercel --prod
```

### 5. Setup Environment Variables

```bash
# Via CLI
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add APP_KEY

# Atau via Dashboard:
# https://vercel.com/dashboard
# Pilih project → Settings → Environment Variables
```

Variables yang perlu ditambahkan:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusevent
JWT_SECRET=your-super-secret-jwt-key-change-this
APP_KEY=iFRPPfvuIoC8LhJaqJ3OMu92-FGKp1oQ
NODE_ENV=production
WEATHER_API_KEY=your-openweathermap-api-key (opsional)
GEOCODING_API_KEY=your-opencage-api-key (opsional)
```

### 6. Akses API

Vercel akan memberikan URL:
```
https://campusevent-api.vercel.app
```

- **Swagger UI**: `https://campusevent-api.vercel.app/docs`
- **API Endpoint**: `https://campusevent-api.vercel.app/events`

### 7. Update Deployment

Setiap kali ada perubahan:
```bash
git add .
git commit -m "Update API"
git push origin main
```

Atau deploy manual:
```bash
vercel --prod
```

## 🔧 Konfigurasi MongoDB Atlas

Vercel tidak menyediakan database, gunakan MongoDB Atlas (gratis):

1. Buka https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string
6. Add ke Vercel environment variables

## ⚡ Tips

- Vercel cocok untuk serverless functions
- Free tier: unlimited deployments
- Auto SSL/HTTPS
- Global CDN
- GitHub auto-deploy

## 📊 Monitoring

Dashboard Vercel menampilkan:
- ✅ Deployment status
- ✅ Build logs
- ✅ Analytics
- ✅ Domain management

## ✅ Checklist

- [ ] Vercel CLI terinstall
- [ ] Login ke Vercel
- [ ] Deploy sukses
- [ ] Environment variables diset
- [ ] MongoDB Atlas ready
- [ ] Test API di Swagger
- [ ] Share URL! 🎉
