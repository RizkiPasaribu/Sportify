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
        Schema::create('fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('venue_id')->constrained('venues')->cascadeOnDelete();
            $table->string('name');
            $table->string('sport_type');
            $table->decimal('price_per_hour', 12, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['sport_type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};
