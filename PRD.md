# Product Requirements Document (PRD): Sportify – Aplikasi Booking Lapangan Olahraga

## 1. Overview & Produk Tujuan

**Sportify** adalah platform digital berbasis web untuk memudahkan pengguna dalam memesan (booking) lapangan olahraga (seperti futsal, badminton, tenis, dan basket) secara real-time. Platform ini dibangun menggunakan modern stack: **Laravel** (backend API & routing), **Inertia.js** (jembatan SPA tanpa REST API terpisah), **React** (frontend UI), **Tailwind CSS** (styling), **PostgreSQL** (database relasional dengan **UUID** sebagai primary key), serta **Laravel Breeze/Sanctum** untuk autentikasi.

### Target Pengguna

1. **Customer (Penyewa):** Mencari lapangan, melihat ketersediaan jadwal, melakukan booking, dan pembayaran.
2. **Mitra / Owner (Pengelola Lapangan):** Mengelola daftar lapangan, jam operasional, harga, dan memvalidasi pesanan masuk.
3. **Admin Sistem:** Mengelola seluruh data pengguna, mitra, laporan transaksi, dan pengaturan platform.

---

## 2. Tech Stack & Arsitektur

- **Backend Framework:** Laravel (PHP 8.2+)
- **Database System:** PostgreSQL (tipe data `UUID` v4 untuk semua tabel relasional utama)
- **Adapter / Glue Code:** Inertia.js
- **Frontend Library:** React.js (dengan Vite bundler)
- **Styling & UI:** Tailwind CSS + Lucide React (ikon)
- **Autentikasi:** Laravel Breeze (Inertia React Stack)

---

## 3. Skema Database (PostgreSQL + UUID)

Semua tabel menggunakan `UUID` sebagai Primary Key (`id`) dan Foreign Key.

```
users (id UUID, name, email, password, role [customer, owner, admin], timestamps)
venues (id UUID, owner_id UUID, name, address, description, phone, images JSON, timestamps)
fields (id UUID, venue_id UUID, name, sport_type [futsal, badminton, etc.], price_per_hour DECIMAL, timestamps)
operating_hours (id UUID, field_id UUID, day_of_week INT, open_time TIME, close_time TIME)
bookings (id UUID, user_id UUID, field_id UUID, booking_date DATE, start_time TIME, end_time TIME, total_price DECIMAL, status [pending, confirmed, cancelled, completed], payment_status [unpaid, paid, refunded], timestamps)
payments (id UUID, booking_id UUID, payment_gateway_ref VARCHAR, amount DECIMAL, payment_method VARCHAR, status VARCHAR, timestamps)
```

---

## 4. Fitur Utama & User Story

### A. Autentikasi & Manajemen Akun

- **Register/Login:** Pengguna dapat mendaftar sebagai _Customer_ atau _Owner_.
- **Role-Based Redirection:** Setelah login, pengguna diarahkan ke dashboard yang sesuai (Customer Dashboard / Owner Dashboard / Admin Panel).

### B. Modul Customer (Penyewa Lapangan)

- **Pencarian & Filter:** Mencari lapangan berdasarkan lokasi, jenis olahraga, atau tanggal bermain.
- **Detail Lapangan:** Melihat informasi fasilitas, foto, ulasan, dan harga per jam.
- **Sistem Booking & Slot Waktu:**
  - Memilih tanggal dan melihat slot waktu yang tersedia (jam operasional dikurangi jam yang sudah dibooking).
  - Mencegah _double booking_ pada jam yang sama melalui validasi transaksi.
- **Checkout & Pembayaran:** Ringkasan biaya dan simulasi/integrasi payment gateway (misal Midtrans/Xendit).
- **Riwayat Pesanan:** Daftar booking aktif, selesai, atau dibatalkan.

### C. Modul Owner (Pengelola Lapangan)

- **Manajemen Venue & Lapangan:** Menambah, mengubah, atau menghapus data venue dan lapangan beserta harga sewa.
- **Manajemen Jadwal & Jam Buka:** Mengatur jam operasional per lapangan.
- **Kelola Booking:** Menerima atau membatalkan pesanan, serta melihat laporan pendapatan.

---

## 5. Struktur Proyek Laravel + Inertia + React

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Customer/
│   │   │   ├── HomeController.php
│   │   │   ├── VenueController.php
│   │   │   └── BookingController.php
│   │   └── Owner/
│   │       ├── DashboardController.php
│   │       ├── VenueManagementController.php
│   │       └── FieldController.php
resources/
├── js/
│   ├── Components/     # Reusable UI (Button, Modal, Card, Navbar)
│   ├── Layouts/        # AppLayout, GuestLayout, DashboardLayout
│   ├── Pages/          # Halaman Inertia (React components)
│   │   ├── Welcome.jsx
│   │   ├── Customer/
│   │   │   ├── Venues/Index.jsx
│   │   │   ├── Venues/Show.jsx
│   │   │   └── Bookings/Index.jsx
│   │   └── Owner/
│   │       ├── Dashboard.jsx
│   │       └── Fields/Index.jsx
│   └── app.jsx
routes/
├── web.php             # Route web terproteksi via Inertia middleware
```

---

## 6. Contoh Implementasi Kode Kunci

### A. Migration Laravel (PostgreSQL UUID)

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('venue_id')->constrained('venues')->onDelete('cascade');
            $table->string('name');
            $table->string('sport_type');
            $table->decimal('price_per_hour', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
```

### B. Konfigurasi Model Laravel dengan UUID

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['venue_id', 'name', 'sport_type', 'price_per_hour'];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}
```

### C. Controller Inertia

```php
namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Field;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function show($id)
    {
        $field = Field::with('venue')->findOrFail($id);

        return Inertia::render('Customer/Venues/Show', [
            'field' => $field,
        ]);
    }
}
```

### D. Komponen Halaman React + Tailwind CSS

```jsx
import React from "react";
import { useForm, Head } from "@inertiajs/react";

export default function Show({ field }) {
  const { data, setData, post, processing, errors } = useForm({
    booking_date: "",
    start_time: "",
    end_time: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("bookings.store", field.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head title={field.name} />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
        <p className="text-gray-600 mt-1">
          {field.venue.name} - Rp {field.price_per_hour} / jam
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Booking
            </label>
            <input
              type="date"
              value={data.booking_date}
              onChange={(e) => setData("booking_date", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            />
            {errors.booking_date && (
              <div className="text-red-500 text-sm mt-1">
                {errors.booking_date}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jam Mulai
              </label>
              <input
                type="time"
                value={data.start_time}
                onChange={(e) => setData("start_time", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Jam Selesai
              </label>
              <input
                type="time"
                value={data.end_time}
                onChange={(e) => setData("end_time", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Pesan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## 7. Langkah Selanjutnya

1. Jalankan `composer create-project laravel/laravel app-booking-lapangan`.
2. Install Laravel Breeze dengan stack React/Inertia.
3. Hubungkan PostgreSQL di file `.env` dan jalankan migration.
4. Buat Seeder/Factory untuk pengujian slot waktu booking.
