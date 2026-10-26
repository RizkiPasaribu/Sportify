# Sportify

Aplikasi booking lapangan olahraga berbasis web. Pelanggan dapat mencari venue, memilih slot jam yang tersedia, dan melakukan pembayaran (simulasi). Pemilik venue mengelola venue, lapangan, harga, jam operasional, serta pesanan. Admin mengawasi pengguna, venue, dan transaksi di seluruh platform.

Dokumentasi kebutuhan produk ada di [`PRD.md`](PRD.md).

---

## Fitur

### Customer
- Pencarian venue dengan filter kota, cabang olahraga, rentang harga, dan kata kunci
- Halaman detail venue: galeri, daftar lapangan, rating, dan ulasan
- Pemilihan slot jam secara real-time (slot yang sudah terisi otomatis nonaktif)
- Pemesanan dengan proteksi bentrok jadwal (double-booking)
- Checkout dan pembayaran simulasi (transfer bank, e-wallet, QRIS, bayar di tempat)
- Riwayat pesanan, detail pesanan, dan pembatalan dengan refund simulasi
- Rating & ulasan venue setelah booking selesai (bintang 1–5 dan komentar)

### Owner
- Dashboard ringkasan pendapatan dan pesanan
- CRUD venue (nama, kota, alamat, deskripsi, gambar, status aktif)
- CRUD lapangan beserta jenis olahraga, harga per jam, dan jam operasional per hari
- Manajemen pesanan: konfirmasi, batalkan, atau tandai selesai
- Laporan pendapatan dengan grafik dan rincian per lapangan

### Admin
- Dashboard statistik platform
- Manajemen pengguna: ubah role, hapus pengguna
- Monitoring seluruh venue
- Monitoring seluruh transaksi dan pembayaran

---

## Stack

| Komponen | Versi |
|---|---|
| PHP | 8.3+ (diuji pada 8.5) |
| Laravel | 13.x |
| PostgreSQL | 16 (UUID sebagai primary key) |
| Inertia.js | 2.x |
| React | 18.x |
| Vite | 8.x |
| Tailwind CSS | 4.x |
| Autentikasi | Laravel Breeze 2.x + Sanctum |
| Ikon | Lucide React |

---

## Prasyarat

Pastikan sudah terpasang:

- PHP 8.3 atau lebih baru beserta ekstensi `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`
- Composer 2
- Node.js 20+ dan npm
- Docker (untuk menjalankan PostgreSQL) — atau PostgreSQL 16 yang sudah terpasang langsung

Cek versi:

```bash
php -v
composer -V
node -v
npm -v
docker -v
```

---

## Instalasi

### 1. Jalankan PostgreSQL

Proyek ini menggunakan container Docker bernama `sportify-postgres` dengan port host `5433`.

Membuat container baru (cukup sekali):

```bash
docker run -d \
  --name sportify-postgres \
  -e POSTGRES_DB=sportify \
  -e POSTGRES_USER=sportify \
  -e POSTGRES_PASSWORD=secret \
  -p 5433:5432 \
  postgres:16-alpine
```

Membuat database untuk pengujian (sekali saja):

```bash
docker exec sportify-postgres psql -U sportify -d sportify -c "CREATE DATABASE sportify_test;"
```

Jika container sudah ada, cukup dinyalakan:

```bash
docker start sportify-postgres
```

Pastikan container berjalan:

```bash
docker ps --filter name=sportify-postgres
```

> Jika port `5433` sudah dipakai proses lain, ganti pemetaan port (misalnya `-p 5434:5432`) lalu sesuaikan `DB_PORT` di `.env` dan `phpunit.xml`.

### 2. Install dependensi

```bash
composer install
npm install
```

### 3. Konfigurasi environment

```bash
cp .env.example .env
php artisan key:generate
```

Nilai default `.env.example` sudah disiapkan untuk PostgreSQL di port `5433`:

```env
APP_NAME=Sportify
APP_URL=http://localhost:8000
APP_LOCALE=id

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=sportify
DB_USERNAME=sportify
DB_PASSWORD=secret
```

Sesuaikan bagian `DB_*` bila konfigurasi PostgreSQL Anda berbeda.

### 4. Migrasi dan seed data demo

```bash
php artisan migrate --seed
```

Untuk mengulang dari nol (menghapus seluruh data):

```bash
php artisan migrate:fresh --seed
```

Seed data yang dihasilkan:

- 5 venue dengan 12 lapangan
- 10 pengguna (1 admin, 2 owner, 7 customer)
- ±172 pesanan dan 97 ulasan sebagai data contoh laporan

### 5. Buat symbolic link storage

Foto venue disimpan di `storage/app/public` dan diakses lewat `/storage/...`, sehingga perlu symbolic link ke folder `public`:

```bash
php artisan storage:link
```

Langkah ini wajib. Tanpa link tersebut, foto venue yang diunggah akan tersimpan tetapi tidak tampil di web (request `/storage/...` gagal).

### 6. Build aset frontend

Untuk mode produksi:

```bash
npm run build
```

---

## Menjalankan Aplikasi

### Cara cepat (satu perintah)

```bash
composer run dev
```

Perintah ini menjalankan empat proses sekaligus: `php artisan serve`, `queue:listen`, `pail` (log), dan `npm run dev` (Vite).

### Cara manual (dua terminal)

Terminal 1 — backend:

```bash
php artisan serve
```

Terminal 2 — frontend dengan hot reload:

```bash
npm run dev
```

Buka **http://localhost:8000**.

---

## Akun Demo

Semua akun menggunakan password `password`.

| Role | Email | Halaman awal |
|---|---|---|
| Customer | `customer@sportify.id` | `/dashboard` |
| Owner | `owner@sportify.id` | `/owner/dashboard` |
| Admin | `admin@sportify.id` | `/admin/dashboard` |

Anda juga dapat mendaftar akun baru melalui halaman `/register` (otomatis berperan sebagai customer).

---

## Pengujian

Pengujian berjalan di database PostgreSQL terpisah (`sportify_test`, dikonfigurasi di `phpunit.xml`).

```bash
php artisan test
```

Menjalankan satu file atau satu tes tertentu:

```bash
php artisan test tests/Feature/BookingFlowTest.php
php artisan test --filter=test_overlapping_booking_is_rejected
```

Cakupan pengujian saat ini: 50 tes, 174 assertion, mencakup alur booking, manajemen owner, manajemen admin, rendering halaman, dan autentikasi.

---

## Perintah Berguna

```bash
php artisan route:list              # daftar seluruh route (55 route)
php artisan route:list --name=owner # filter route berdasarkan nama
php artisan migrate:fresh --seed    # reset database + seed ulang
php artisan tinker                  # REPL untuk eksplorasi data
php artisan queue:work              # jalankan worker queue secara manual
php artisan pail                    # tail log real-time
```

Format kode PHP:

```bash
vendor/bin/pint app routes database tests
```

---

## Struktur Direktori Penting

```
app/
├── Enums/                  # UserRole, BookingStatus, PaymentStatus, dll.
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Dashboard, Users, Venues, Bookings
│   │   ├── Customer/       # Venues, Bookings, Dashboard
│   │   └── Owner/          # Venues, Fields, Bookings, Reports, Dashboard
│   ├── Middleware/         # EnsureRole
│   └── Requests/           # StoreBookingRequest, dll.
├── Models/                 # User, Venue, Field, Booking, Payment, Review, ...
├── Policies/               # VenuePolicy, FieldPolicy, BookingPolicy
└── Services/
    ├── BookingService.php  # ketersediaan slot + pembuatan booking anti-bentrok
    └── PaymentService.php  # pembayaran & refund simulasi

resources/js/
├── Components/             # VenueCard, SlotPicker, FieldForm, dll.
├── Layouts/                # AppLayout, DashboardLayout, GuestLayout
└── Pages/
    ├── Admin/  Customer/  Owner/  Auth/  Profile/

database/
├── migrations/             # skema UUID PostgreSQL
├── factories/
└── seeders/

public/images/venues/       # artwork venue (SVG lokal)
```

---

## Cara Kerja Pencegahan Double-Booking

`App\Services\BookingService` membungkus proses pembuatan booking dalam transaksi database:

1. Mengunci baris lapangan dengan `lockForUpdate()`
2. Mencari booking lain pada lapangan dan tanggal yang sama dengan status `pending`, `confirmed`, atau `completed`
3. Menolak permintaan jika ada irisan waktu
4. Menyimpan booking beserta pembayarannya

Dengan begitu, dua permintaan bersamaan untuk slot yang sama tidak dapat lolos.

---

## Cara Kerja Rating & Ulasan

Ulasan hanya bisa dibuat oleh customer yang booking-nya sudah selesai:

1. Booking harus berstatus `completed`. Booking `confirmed` otomatis menjadi `completed` setelah jam selesainya lewat (dicek saat halaman booking dibuka dan oleh scheduler tiap jam).
2. Buka **Booking Saya → tab Selesai**, lalu klik **Beri Rating**.
3. Pilih 1–5 bintang, isi komentar (opsional), lalu klik **Kirim Ulasan**.
4. Rating langsung muncul di halaman venue dan rata-rata rating venue ikut berubah.

Pintasan **Beri Rating** juga tersedia di dashboard customer dan di bagian ulasan halaman venue. Satu booking hanya bisa diulas satu kali (dijaga oleh unique index `reviews.booking_id`).

---

## Kebijakan Refund

Pembatalan booking yang sudah dibayar (oleh admin, owner, atau customer sebelum jadwal) otomatis memproses refund simulasi:

1. `payment_status` booking berubah menjadi `refunded`.
2. Record pembayaran berubah menjadi `refunded` dan menyimpan waktu proses di `gateway_response.refunded_at`.
3. Customer melihat badge **Dana Dikembalikan** di Booking Saya, serta nominal, metode, dan waktu refund di detail booking.
4. Admin melihat nominal refund pada notifikasi setelah membatalkan dan tanggal refund di kolom Pembayaran pada tabel Transaksi.
5. Owner melihat status pembayaran **Dana Dikembalikan** di daftar booking miliknya.

---

## Troubleshooting

**`SQLSTATE[08006] could not connect to server`**
Container PostgreSQL belum berjalan. Jalankan `docker start sportify-postgres` lalu cek dengan `docker ps`.

**`Unable to locate file in Vite manifest`**
Aset frontend belum dibangun. Jalankan `npm run build`, atau gunakan `npm run dev` / `composer run dev` saat pengembangan.

**Perubahan tampilan tidak muncul**
Hentikan lalu jalankan ulang `npm run dev`, atau jalankan `npm run build` bila memakai build produksi. Hapus cache browser jika perlu.

**Foto venue tidak tampil setelah upload**
Symbolic link storage belum dibuat. Jalankan:
```bash
php artisan storage:link
```
Lalu muat ulang halaman. File aslinya ada di `storage/app/public/venues/`.

**`database "sportify_test" does not exist`**
Buat database pengujian:
```bash
docker exec sportify-postgres psql -U sportify -d sportify -c "CREATE DATABASE sportify_test;"
```

**Port 8000 sudah dipakai**
Jalankan di port lain: `php artisan serve --port=8001`, lalu sesuaikan `APP_URL` di `.env`.

**Login gagal setelah `migrate:fresh`**
Gunakan akun demo di atas dengan password `password`; akun lama sudah terhapus oleh proses reset.

---

## Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan demonstrasi.
