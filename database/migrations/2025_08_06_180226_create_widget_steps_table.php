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
        Schema::create('widget_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('step_key', 50);
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->json('prompt')->nullable();
            $table->json('options')->nullable();
            $table->json('buttons')->nullable();
            $table->json('layout')->nullable();
            $table->json('validation')->nullable();
            $table->integer('order_index');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            
            $table->index(['widget_id', 'order_index']);
            $table->unique(['widget_id', 'step_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widget_steps');
    }
};
