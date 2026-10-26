<?php

namespace Database\Factories;

use App\Models\Field;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Field>
 */
class FieldFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sport = fake()->randomElement(['futsal', 'badminton', 'tennis', 'basket']);

        return [
            'venue_id' => Venue::factory(),
            'name' => ucfirst($sport).' '.fake()->numberBetween(1, 5),
            'sport_type' => $sport,
            'price_per_hour' => fake()->randomElement([80000, 100000, 120000, 150000, 200000]),
            'is_active' => true,
        ];
    }
}
