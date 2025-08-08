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
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('service_category');
            $table->string('service_subcategory')->nullable();
            $table->string('domain')->nullable();
            $table->string('company_name');
            $table->enum('status', ['draft', 'published', 'paused'])->default('draft');
            $table->string('widget_key', 32)->unique();
            $table->string('embed_domain')->nullable();
            $table->json('enabled_modules')->nullable();
            $table->json('module_configs')->nullable();
            $table->json('branding')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index(['company_id', 'status']);
            $table->index('widget_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
