<?php

namespace Database\Factories;

use App\Models\Field;
use App\Models\OperatingHour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OperatingHour>
 */
class OperatingHourFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'field_id' => Field::factory(),
            'day_of_week' => fake()->numberBetween(0, 6),
            'open_time' => '08:00',
            'close_time' => '22:00',
            'is_closed' => false,
        ];
    }
}
