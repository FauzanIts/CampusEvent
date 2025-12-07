# 🚀 Deploy CampusEvent API ke Railway

## Langkah-langkah Deploy:

### 1. Persiapan Akun Railway

1. **Buka** https://railway.app
2. **Sign up/Login** menggunakan GitHub
3. **Verifikasi email** Anda

### 2. Install Railway CLI (Opsional)

```bash
npm install -g @railway/cli
```

### 3. Deploy via Web (Cara Termudah)

#### A. Dari GitHub Repository:

1. **Push code ke GitHub** (jika belum):
   ```bash
   cd C:\Project_S3\API\campusevent
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Buka Railway Dashboard**:
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `CampusEvent`
   - Pilih direktori `backend`

3. **Railway akan otomatis detect dan deploy!**

#### B. Deploy dari CLI:

```bash
# Login ke Railway
railway login

# Pindah ke direktori backend
cd C:\Project_S3\API\campusevent\backend

# Inisialisasi project Railway
railway init

# Deploy!
railway up

# Buka di browser
railway open
```

### 4. Setup Environment Variables di Railway

Setelah deploy, tambahkan environment variables:

1. **Buka project di Railway Dashboard**
2. **Klik tab "Variables"**
3. **Tambahkan variables berikut:**

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=production
APP_KEY=iFRPPfvuIoC8LhJaqJ3OMu92-FGKp1oQ

# MongoDB (gunakan MongoDB Atlas gratis)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusevent

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Weather API (opsional)
WEATHER_API_KEY=your-openweathermap-api-key

# Geocoding API (opsional)
GEOCODING_API_KEY=your-opencage-api-key
```

### 5. Setup MongoDB Atlas (Database)

Railway tidak menyediakan MongoDB gratis, gunakan MongoDB Atlas:

1. **Buka** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 Sandbox - FREE)
3. **Buat database user** dan **password**
4. **Whitelist IP**: `0.0.0.0/0` (allow all)
5. **Copy connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/campusevent
   ```
6. **Paste ke Railway variable** `MONGODB_URI`

### 6. Generate Domain

Railway akan memberikan domain otomatis:
```
https://your-app-name.up.railway.app
```

Atau tambahkan custom domain di Railway Dashboard.

### 7. Akses API Anda

Setelah deploy sukses:

- **Swagger UI**: `https://your-app.up.railway.app/docs`
- **API Base**: `https://your-app.up.railway.app`
- **Health Check**: `https://your-app.up.railway.app/`

### 8. Monitoring

Railway Dashboard menampilkan:
- ✅ Deployment logs
- ✅ Resource usage
- ✅ Request metrics
- ✅ Build history

## 🔧 Update Deployment

Setiap kali push ke GitHub, Railway akan otomatis redeploy!

```bash
git add .
git commit -m "Update API"
git push origin main
```

Railway akan otomatis build dan deploy dalam 2-3 menit.

## 📊 Biaya

- **Free Tier**: $5 kredit gratis per bulan
- **Hobby Plan**: $5/bulan untuk unlimited
- Cukup untuk development dan demo

## ⚡ Tips

1. **Gunakan Railway Variables** untuk semua config sensitif
2. **Aktifkan GitHub auto-deploy** untuk CI/CD otomatis
3. **Monitor logs** di Railway Dashboard
4. **Setup MongoDB Atlas** sebelum deploy
5. **Test API** di Swagger setelah deploy

## 🆘 Troubleshooting

### Build Failed:
```bash
# Cek logs di Railway Dashboard
railway logs
```

### Cannot connect to MongoDB:
- Pastikan MongoDB Atlas whitelist IP `0.0.0.0/0`
- Cek connection string benar
- Pastikan database user memiliki akses

### Port Already in Use:
- Railway otomatis assign PORT via environment variable
- Pastikan `env.ts` membaca `PORT` dari environment

## 📝 Checklist Deploy:

- [ ] File konfigurasi Railway sudah dibuat
- [ ] Code sudah di push ke GitHub
- [ ] Akun Railway sudah dibuat
- [ ] MongoDB Atlas cluster sudah siap
- [ ] Environment variables sudah diset
- [ ] Deploy berhasil
- [ ] Test API via Swagger
- [ ] Share URL ke teman/dosen! 🎉
