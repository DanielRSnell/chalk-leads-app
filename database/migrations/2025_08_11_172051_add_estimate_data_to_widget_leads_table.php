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
        Schema::table('widget_leads', function (Blueprint $table) {
            $table->json('form_responses')->after('contact_info');
            $table->json('estimate_breakdown')->after('form_responses');
            $table->decimal('base_price', 10, 2)->nullable()->after('estimate_breakdown');
            $table->decimal('subtotal', 10, 2)->nullable()->after('base_price');
            $table->decimal('tax_amount', 10, 2)->nullable()->after('subtotal');
            $table->decimal('total_price', 10, 2)->nullable()->after('tax_amount');
            $table->string('currency', 3)->default('USD')->after('total_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('widget_leads', function (Blueprint $table) {
            $table->dropColumn([
                'form_responses',
                'estimate_breakdown', 
                'base_price',
                'subtotal',
                'tax_amount',
                'total_price',
                'currency'
            ]);
        });
    }
};
