# Supabase Keep-Alive Setup

Dokumentasi untuk mencegah Supabase free tier suspend dengan Vercel Cron.

## 📌 Masalah

Supabase free tier akan suspend otomatis setiap 1 minggu jika tidak ada API request. Solusinya adalah membuat scheduled job yang melakukan ping ke database secara berkala.

## ✅ Solusi yang Sudah Dibuat

### 1. API Route Keep-Alive

File: `app/api/cron/keep-alive/route.ts`

- Endpoint yang melakukan query sederhana ke Supabase
- Protected dengan `CRON_SECRET` untuk security
- Query ke table `packages` (bisa diganti sesuai kebutuhan)
- Return status success/error dengan timestamp

### 2. Vercel Cron Configuration

File: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule**: `0 */6 * * *` = Tiap 6 jam sekali
- Hari 1: 00:00, 06:00, 12:00, 18:00
- Hari 2: 00:00, 06:00, 12:00, 18:00
- dst...

**Alternatif Schedule** (pilih salah satu):
- `0 */4 * * *` - Tiap 4 jam
- `0 */8 * * *` - Tiap 8 jam
- `0 */12 * * *` - Tiap 12 jam
- `0 0 * * *` - Tiap hari jam 00:00
- `0 0,12 * * *` - Tiap hari jam 00:00 dan 12:00

## 🚀 Cara Setup di Vercel

### Step 1: Generate CRON_SECRET

Jalankan di terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasilnya (contoh: `a1b2c3d4e5f6...`)

### Step 2: Setup Environment Variable di Vercel

1. Buka project di Vercel Dashboard
2. Settings → Environment Variables
3. Tambahkan variable baru:
   - **Name**: `CRON_SECRET`
   - **Value**: Paste hasil dari Step 1
   - **Environment**: Production (dan Deployment jika perlu)
4. Save

### Step 3: Deploy

```bash
# Push ke repository
git add .
git commit -m "Add Supabase keep-alive cron"
git push

# Atau deploy manual via Vercel CLI
vercel --prod
```

### Step 4: Verifikasi

1. Di Vercel Dashboard → Project → Cron Jobs
2. Akan muncul cron job dengan schedule `0 */6 * * *`
3. Tunggu sampai cron berjalan atau trigger manual
4. Check logs di Vercel Dashboard → Deployments → Functions

## 🧪 Testing Cron Job

### Test Manual di Local

```bash
# Generate CRON_SECRET dulu
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Tambahkan ke .env
echo "CRON_SECRET=your_generated_secret" >> .env

# Test endpoint
curl http://localhost:3000/api/cron/keep-alive \
  -H "Authorization: Bearer your_generated_secret"
```

Response success:
```json
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": { "id": "..." }
}
```

### Test di Production

```bash
curl https://your-app.vercel.app/api/cron/keep-alive \
  -H "Authorization: Bearer your_cron_secret"
```

## 📊 Monitoring

### Check Cron Execution di Vercel

1. Vercel Dashboard → Project
2. Tab "Cron Jobs"
3. Lihat execution history, success rate, dan errors

### Check Supabase Activity

1. Supabase Dashboard → Project
2. Tab "Database" → "Query Performance"
3. Akan terlihat query dari keep-alive endpoint

## 🔧 Troubleshooting

### Cron tidak muncul di Vercel Dashboard

- Pastikan `vercel.json` ada di root project
- Redeploy project
- Cron hanya tersedia di Vercel Production deployment

### Error 401 Unauthorized

- Check `CRON_SECRET` sudah di-set di Vercel Environment Variables
- Pastikan value sama dengan yang di request header
- Redeploy setelah add env variable

### Error 500 / Query Failed

- Check Supabase masih aktif (bisa jadi sudah suspend)
- Check table `packages` exists
- Ganti ke table lain jika perlu (edit `route.ts`)
- Check Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Supabase masih suspend

- Check schedule cron sudah benar
- Pastikan cron sudah running (check di Vercel Dashboard)
- Supabase free tier suspend setelah 7 hari inactivity
- Schedule minimal setiap 6 hari sekali (rekomendasi tiap 6 jam untuk safety)

## 💡 Tips

1. **Monitoring**: Set up alert di Vercel untuk failed cron executions
2. **Backup Plan**: Bisa tambah cron dari service lain (UptimeRobot, Cron-job.org) sebagai backup
3. **Cost**: Vercel Cron free untuk Hobby plan (limited executions)
4. **Table Choice**: Pilih table yang ringan dan jarang berubah untuk query
5. **Log**: Check function logs secara berkala untuk pastikan cron berjalan

## 📝 Notes

- Vercel Cron hanya support UTC timezone
- `0 */6 * * *` = 00:00, 06:00, 12:00, 18:00 UTC
- Konversi ke WIB = +7 jam (07:00, 13:00, 19:00, 01:00 WIB)
- Free tier Vercel ada limit untuk cron executions (check quota)
