<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('operating_hours', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('field_id')->constrained('fields')->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week');
            $table->time('open_time');
            $table->time('close_time');
            $table->boolean('is_closed')->default(false);
            $table->timestamps();

            $table->unique(['field_id', 'day_of_week']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operating_hours');
    }
};
