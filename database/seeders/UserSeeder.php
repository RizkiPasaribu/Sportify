<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        User::updateOrCreate(
            ['email' => 'admin@sportify.id'],
            [
                'name' => 'Admin Sportify',
                'password' => $password,
                'role' => UserRole::Admin,
                'email_verified_at' => now(),
            ],
        );

        $owner = User::updateOrCreate(
            ['email' => 'owner@sportify.id'],
            [
                'name' => 'Budi Santoso',
                'password' => $password,
                'role' => UserRole::Owner,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => 'owner2@sportify.id'],
            [
                'name' => 'Siti Rahma',
                'password' => $password,
                'role' => UserRole::Owner,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => 'customer@sportify.id'],
            [
                'name' => 'Andi Pratama',
                'password' => $password,
                'role' => UserRole::Customer,
                'email_verified_at' => now(),
            ],
        );

        User::factory()
            ->count(6)
            ->create();

        $owner->refresh();
    }
}
