<?php

namespace App\Models;

use Database\Factories\OperatingHourFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['field_id', 'day_of_week', 'open_time', 'close_time', 'is_closed'])]
class OperatingHour extends Model
{
    /** @use HasFactory<OperatingHourFactory> */
    use HasFactory, HasUuids;

    /**
     * @var array<int, string>
     */
    public const DAY_NAMES = [
        0 => 'Minggu',
        1 => 'Senin',
        2 => 'Selasa',
        3 => 'Rabu',
        4 => 'Kamis',
        5 => 'Jumat',
        6 => 'Sabtu',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_closed' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Field, $this>
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }

    public function dayName(): string
    {
        return self::DAY_NAMES[$this->day_of_week] ?? '-';
    }
}
