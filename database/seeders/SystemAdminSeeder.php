<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SystemAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create system administrator user
        User::firstOrCreate(
            ['email' => 'admin@chalkleads.com'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@chalkleads.com',
                'password' => Hash::make('admin123'),
                'role' => 'system_admin',
                'company_id' => null, // System admin doesn't belong to a specific company
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('System administrator created: admin@chalkleads.com / admin123');
    }
}
