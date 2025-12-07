# 🚀 Deploy CampusEvent API ke Render.com

## Langkah-langkah Deploy (Via Web Dashboard):

### 1. Buat Akun Render

1. **Buka** https://render.com
2. **Sign up** dengan GitHub account
3. **Authorize** Render untuk akses repository GitHub Anda

### 2. Deploy dari GitHub

1. **Buka Dashboard** https://dashboard.render.com

2. **Klik "New +"** → **"Web Service"**

3. **Connect Repository:**
   - Pilih `FauzanIts/CampusEvent`
   - Jika tidak muncul, klik "Configure account" untuk grant akses

4. **Konfigurasi Service:**
   ```
   Name: campusevent-api
   Region: Oregon (US West) - atau pilih terdekat
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

5. **Plan:** Pilih **Free** (0$/month)

6. **Environment Variables:** Klik "Advanced" dan tambahkan:
   ```
   NODE_ENV = production
   PORT = 3333
   HOST = 0.0.0.0
   APP_KEY = iFRPPfvuIoC8LhJaqJ3OMu92-FGKp1oQ
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/campusevent
   JWT_SECRET = your-super-secret-jwt-key-change-this
   ```

7. **Klik "Create Web Service"**

Render akan:
- Clone repository Anda
- Install dependencies
- Build aplikasi
- Deploy dan start server
- Berikan URL publik

### 3. Setup MongoDB Atlas (Jika belum)

Render tidak menyediakan database gratis, gunakan MongoDB Atlas:

1. **Buka** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 Sandbox - FREE Forever)
3. **Database Access:**
   - Buat user dengan password
   - Simpan username dan password
4. **Network Access:**
   - Klik "Add IP Address"
   - Pilih "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String:**
   - Klik "Connect" → "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://<username>:<password>@cluster.mongodb.net/campusevent
     ```
   - Ganti `<username>` dan `<password>` dengan credentials Anda
6. **Paste ke Render Environment Variables** sebagai `MONGODB_URI`

### 4. Akses API

Setelah deploy selesai (5-10 menit pertama kali), Render akan berikan URL:

```
https://campusevent-api.onrender.com
```

**Swagger Documentation:**
```
https://campusevent-api.onrender.com/docs
```

**API Endpoints:**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /events` - List all events
- `POST /events` - Create event
- `GET /events/{id}` - Get event detail
- `PUT /events/{id}` - Update event
- `DELETE /events/{id}` - Delete event
- `GET /events/{id}/weather` - Get weather info

### 5. Auto-Deploy

Setiap kali Anda push ke GitHub branch `main`, Render akan otomatis:
- Pull perubahan terbaru
- Rebuild aplikasi
- Redeploy service

```bash
git add .
git commit -m "Update API"
git push origin main
```

Render akan auto-deploy dalam 2-3 menit.

### 6. Monitoring

Dashboard Render menampilkan:
- ✅ Deployment status & logs
- ✅ Service metrics (CPU, Memory, Bandwidth)
- ✅ Environment variables
- ✅ Custom domain settings
- ✅ SSL certificate (auto HTTPS)

**Logs realtime:**
```
https://dashboard.render.com/web/{service-id}/logs
```

### 7. Custom Domain (Opsional)

Render free tier support custom domain:
1. Buka service settings
2. Tambahkan custom domain
3. Update DNS records di domain provider
4. SSL otomatis via Let's Encrypt

## 🎯 Kelebihan Render.com

- ✅ **100% Gratis** untuk 1 web service
- ✅ **Auto SSL/HTTPS** gratis
- ✅ **Auto-deploy** dari GitHub
- ✅ **750 hours/month** free tier
- ✅ **Custom domain** support
- ✅ **Environment variables** management
- ✅ **Logs & monitoring** built-in
- ✅ **No credit card** required

## ⚠️ Limitasi Free Tier

- Service akan **sleep setelah 15 menit tidak ada request**
- Request pertama setelah sleep akan lambat (~30 detik cold start)
- **750 hours/month** runtime (cukup untuk 24/7 1 service)
- **100 GB bandwidth/month**

## 💡 Tips

1. **Untuk production serius:** Upgrade ke Starter plan ($7/bulan) untuk no sleep
2. **Keep alive:** Buat cron job ping API setiap 10 menit untuk cegah sleep
3. **Monitor logs:** Cek logs saat ada error
4. **Environment variables:** Jangan hardcode secrets di code

## 🆘 Troubleshooting

### Build Failed
```
Cek logs di dashboard → Biasanya masalah dependencies
```

### Cannot Connect to MongoDB
```
1. Cek MongoDB Atlas whitelist IP: 0.0.0.0/0
2. Cek connection string benar
3. Cek database user & password
```

### Service Tidak Responding
```
1. Cek logs untuk error
2. Pastikan PORT environment variable diset
3. Restart service manually di dashboard
```

## ✅ Checklist Deploy

- [ ] Akun Render.com dibuat
- [ ] Repository GitHub connected
- [ ] Service created dengan config benar
- [ ] MongoDB Atlas cluster ready
- [ ] Environment variables diset semua
- [ ] Deploy sukses (cek logs)
- [ ] Test API via Swagger: `https://your-app.onrender.com/docs`
- [ ] Register user test
- [ ] Test create event
- [ ] Share URL ke teman/dosen! 🎉

## 📝 Next Steps

Setelah deploy:
1. Test semua endpoint via Swagger
2. Update frontend API URL (jika ada)
3. Share URL dokumentasi
4. Monitor logs untuk error
5. Setup custom domain (opsional)

---

**URL API:** https://your-app.onrender.com

**Swagger UI:** https://your-app.onrender.com/docs

**Dashboard:** https://dashboard.render.com
