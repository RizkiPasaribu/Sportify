<?php

namespace Database\Seeders;

use App\Models\Field;
use App\Models\OperatingHour;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ownerBudi = User::where('email', 'owner@sportify.id')->firstOrFail();
        $ownerSiti = User::where('email', 'owner2@sportify.id')->firstOrFail();

        $venues = [
            [
                'owner_id' => $ownerBudi->id,
                'name' => 'Sportify Arena Kemang',
                'city' => 'Jakarta Selatan',
                'address' => 'Jl. Kemang Raya No. 18, Bangka, Mampang Prapatan, Jakarta Selatan',
                'description' => 'Arena olahraga indoor premium dengan lapangan futsal berstandar internasional, pendingin udara, dan area tunggu yang nyaman. Cocok untuk pertandingan rutin maupun turnamen komunitas.',
                'phone' => '081234567890',
                'images' => ['/images/venues/futsal.svg', '/images/venues/futsal-2.svg'],
                'facilities' => ['parking', 'shower', 'waiting_room', 'canteen', 'wifi', 'security', 'locker', 'prayer_room'],
                'fields' => [
                    ['name' => 'Futsal Court A', 'sport_type' => 'futsal', 'price_per_hour' => 150000],
                    ['name' => 'Futsal Court B', 'sport_type' => 'futsal', 'price_per_hour' => 150000],
                    ['name' => 'Badminton Hall 1', 'sport_type' => 'badminton', 'price_per_hour' => 90000],
                ],
            ],
            [
                'owner_id' => $ownerBudi->id,
                'name' => 'Garuda Futsal Park',
                'city' => 'Yogyakarta',
                'address' => 'Jl. Magelang KM 5, Sinduadi, Mlati, Sleman, Yogyakarta',
                'description' => 'Lapangan futsal outdoor dengan rumput sintetis berkualitas, pencahayaan LED untuk malam hari, dan kantin yang menyediakan minuman serta camilan.',
                'phone' => '081298765432',
                'images' => ['/images/venues/futsal-2.svg'],
                'facilities' => ['parking', 'shower', 'canteen', 'security', 'locker'],
                'fields' => [
                    ['name' => 'Lapangan Garuda', 'sport_type' => 'futsal', 'price_per_hour' => 100000],
                    ['name' => 'Lapangan Merdeka', 'sport_type' => 'futsal', 'price_per_hour' => 120000],
                ],
            ],
            [
                'owner_id' => $ownerSiti->id,
                'name' => 'Smash Badminton Center',
                'city' => 'Bandung',
                'address' => 'Jl. Setiabudi No. 112, Gegerkalong, Sukasari, Bandung',
                'description' => 'Gedung badminton dengan 6 lapangan karpet vinyl, sirkulasi udara baik, dan tersedia penyewaan raket serta shuttlecock. Lokasi strategis dekat kampus.',
                'phone' => '082211334455',
                'images' => ['/images/venues/badminton.svg'],
                'facilities' => ['parking', 'shower', 'waiting_room', 'canteen', 'wifi', 'locker'],
                'fields' => [
                    ['name' => 'Court 1', 'sport_type' => 'badminton', 'price_per_hour' => 70000],
                    ['name' => 'Court 2', 'sport_type' => 'badminton', 'price_per_hour' => 70000],
                    ['name' => 'Court 3 (Premium)', 'sport_type' => 'badminton', 'price_per_hour' => 90000],
                ],
            ],
            [
                'owner_id' => $ownerSiti->id,
                'name' => 'Ace Tennis Club',
                'city' => 'Jakarta Pusat',
                'address' => 'Jl. Cikini Raya No. 45, Menteng, Jakarta Pusat',
                'description' => 'Klub tenis dengan lapangan hard court outdoor dan indoor. Tersedia pelatih profesional, ball machine, serta lounge untuk anggota.',
                'phone' => '081377788899',
                'images' => ['/images/venues/tennis.svg'],
                'facilities' => ['parking', 'shower', 'waiting_room', 'wifi', 'security', 'locker'],
                'fields' => [
                    ['name' => 'Hard Court 1', 'sport_type' => 'tennis', 'price_per_hour' => 200000],
                    ['name' => 'Indoor Court', 'sport_type' => 'tennis', 'price_per_hour' => 250000],
                ],
            ],
            [
                'owner_id' => $ownerSiti->id,
                'name' => 'Hoops Basketball Hub',
                'city' => 'Surabaya',
                'address' => 'Jl. Darmo Permai Selatan No. 9, Pradahkalikendal, Dukuh Pakis, Surabaya',
                'description' => 'Lapangan basket indoor dengan lantai kayu, ring hidrolik, dan papan skor digital. Ideal untuk latihan tim dan pertandingan antar komunitas.',
                'phone' => '081555667788',
                'images' => ['/images/venues/basket.svg'],
                'facilities' => ['parking', 'shower', 'waiting_room', 'wifi', 'security', 'prayer_room'],
                'fields' => [
                    ['name' => 'Main Court', 'sport_type' => 'basket', 'price_per_hour' => 180000],
                    ['name' => 'Training Court', 'sport_type' => 'basket', 'price_per_hour' => 130000],
                ],
            ],
        ];

        DB::transaction(function () use ($venues): void {
            foreach ($venues as $venueData) {
                $fields = $venueData['fields'];
                unset($venueData['fields']);

                $venue = Venue::create($venueData);

                foreach ($fields as $fieldData) {
                    $field = Field::create([...$fieldData, 'venue_id' => $venue->id]);

                    foreach (range(0, 6) as $day) {
                        $isWeekend = in_array($day, [0, 6], true);

                        OperatingHour::create([
                            'field_id' => $field->id,
                            'day_of_week' => $day,
                            'open_time' => $isWeekend ? '07:00' : '08:00',
                            'close_time' => $isWeekend ? '23:00' : '22:00',
                            'is_closed' => false,
                        ]);
                    }
                }
            }
        });
    }
}
