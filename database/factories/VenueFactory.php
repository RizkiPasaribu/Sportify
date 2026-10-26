<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Venue>
 */
class VenueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $city = fake()->randomElement(['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali']);

        return [
            'owner_id' => User::factory()->owner(),
            'name' => fake()->company().' Sports Center',
            'city' => $city,
            'address' => fake()->streetAddress().', '.$city,
            'description' => fake()->paragraph(),
            'phone' => fake()->numerify('08##########'),
            'images' => ['/images/venues/futsal.svg'],
        ];
    }
}
