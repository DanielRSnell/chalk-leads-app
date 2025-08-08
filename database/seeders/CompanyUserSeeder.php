<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompanyUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo company
        $company = \App\Models\Company::create([
            'name' => 'Demo Widget Company',
            'domain' => 'demo.chalkleads.com',
            'subscription_tier' => 'pro',
            'is_active' => true,
        ]);

        // Create admin user for the company
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@demo.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create regular user for the company
        \App\Models\User::create([
            'name' => 'Regular User',
            'email' => 'user@demo.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
