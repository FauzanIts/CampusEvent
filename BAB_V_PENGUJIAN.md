# BAB V – PENGUJIAN DAN EVALUASI

## 5.1 Pengujian dan Evaluasi

Pengujian pada CampusEvent API dilakukan untuk memastikan bahwa autentikasi, CRUD event, dan integrasi dengan layanan eksternal berjalan sesuai spesifikasi. Seluruh proses diuji menggunakan **Japa Test Framework**, yang memberikan kemudahan dalam membuat request HTTP, memeriksa status code, dan memvalidasi struktur respons JSON.

Pengujian mencakup health check dasar, uji register dan login, serta verifikasi akses endpoint yang membutuhkan JWT. Pada pengujian event, seluruh operasi CRUD dilakukan secara berurutan untuk memastikan konsistensi data. Berbagai skenario error juga diuji, seperti akses tanpa token atau tanpa API key, untuk memastikan sistem memberikan respons 401 atau 403 sesuai aturan keamanan.

Integrasi geocoding diuji untuk memastikan koordinat otomatis dapat dihasilkan, dan sistem tetap stabil jika terjadi error pada layanan eksternal. Integrasi cuaca juga diuji melalui endpoint khusus, memastikan data cuaca hanya diberikan untuk event yang memiliki koordinat.

## 5.2 Hasil Pengujian

### 5.2.1 Summary Hasil

| Metrik | Nilai | Status |
|--------|-------|--------|
| Total Test Cases | 18 | ✅ |
| Tests Passed | 18 | ✅ 100% |
| Tests Failed | 0 | ✅ |
| Total Waktu Eksekusi | 15 detik | ✅ |

### 5.2.2 Hasil per Kategori

#### A. Pengujian Autentikasi (5 tests ✅)

| No | Test Case | Status |
|----|-----------|--------|
| 1 | Harus berhasil mendaftarkan pengguna baru | ✅ Passed |
| 2 | Tidak boleh mendaftar dengan email yang sama | ✅ Passed |
| 3 | Harus berhasil login dengan kredensial yang valid | ✅ Passed |
| 4 | Tidak boleh login dengan password yang salah | ✅ Passed |
| 5 | Tidak boleh login dengan email yang tidak terdaftar | ✅ Passed |

#### B. Operasi CRUD Event (9 tests ✅)

| No | Test Case | Status |
|----|-----------|--------|
| 1 | Harus berhasil membuat event baru | ✅ Passed |
| 2 | Tidak boleh membuat event tanpa autentikasi | ✅ Passed |
| 3 | Harus berhasil mendapatkan semua event | ✅ Passed |
| 4 | Harus berhasil mendapatkan event berdasarkan ID | ✅ Passed |
| 5 | Harus mengembalikan 404 untuk event yang tidak ada | ✅ Passed |
| 6 | Harus berhasil mengupdate event | ✅ Passed |
| 7 | Harus berhasil menghapus event dengan JWT dan API key | ✅ Passed |
| 8 | Tidak boleh menghapus event tanpa API key | ✅ Passed |
| 9 | Harus berhasil mencari event berdasarkan lokasi | ✅ Passed |

#### C. Integrasi API Eksternal (3 tests ✅)

| No | Test Case | Status |
|----|-----------|--------|
| 1 | Harus berhasil membuat event dengan atau tanpa geocoding | ✅ Passed |
| 2 | Harus berhasil mendapatkan info cuaca untuk event dengan koordinat | ✅ Passed |
| 3 | Harus mengembalikan error untuk request cuaca pada event tanpa koordinat | ✅ Passed |

#### D. Pengujian API Dasar (1 test ✅)

| No | Test Case | Status |
|----|-----------|--------|
| 1 | Harus mengembalikan pesan sambutan API | ✅ Passed |

### 5.2.3 Dashboard Visual Hasil Pengujian

Dashboard visual hasil pengujian telah dibuat dan di-deploy ke GitHub Pages untuk kemudahan akses tanpa perlu menjalankan test suite secara lokal.

**URL Dokumentasi Testing:**
```
https://fauzanits.github.io/CampusEvent/test-results.html
```

![Screenshot Dashboard Test Results](docs/images/test-results-dashboard.png)
*Gambar 5.1: Dashboard Visual Hasil Pengujian CampusEvent API*

## 5.3 Analisis Coverage

Dengan 18 dari 18 test cases berhasil (100% pass rate), CampusEvent API telah memenuhi standar pengujian yang komprehensif:

| Aspek | Coverage | Status |
|-------|----------|--------|
| JWT Authentication | 100% | ✅ |
| API Key Authorization | 100% | ✅ |
| CRUD Operations | 100% | ✅ |
| External API Integration | 100% | ✅ |
| Error Handling | 100% | ✅ |

## 5.4 Kesimpulan Pengujian

Berdasarkan eksekusi terhadap 18 test cases, dapat disimpulkan bahwa:

1. **CampusEvent API telah memenuhi semua spesifikasi fungsional** dengan success rate 100%

2. **Mekanisme keamanan berfungsi dengan baik**, meliputi JWT authentication dan API Key authorization

3. **Operasi CRUD event lengkap dan stabil**, dengan error handling yang comprehensive

4. **Integrasi dengan API eksternal reliable**, dengan graceful degradation strategy

5. **Dokumentasi testing accessible**, melalui dashboard visual di GitHub Pages

Secara keseluruhan, **CampusEvent API telah memenuhi kebutuhan utama sebagai backend manajemen event kampus** dengan dokumentasi pengujian yang lengkap dan terverifikasi. Hasil testing membuktikan **stabilitas dan reliability sistem** untuk deployment ke production environment.

---

**Referensi Dokumentasi:**
- Test Results: https://fauzanits.github.io/CampusEvent/test-results.html
- API Documentation: https://fauzanits.github.io/CampusEvent/swagger.html
