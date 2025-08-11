<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\Widget;
use Illuminate\Support\Facades\Hash;

class ProductionDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create companies first
        $companies = [
            [
                'id' => 1,
                'name' => 'Demo Widget Company',
                'domain' => 'demo.chalkleads.com',
                'created_at' => '2025-08-06 20:21:39',
                'updated_at' => '2025-08-06 20:21:39',
            ],
            [
                'id' => 2,
                'name' => 'Atlanta Moving Company',
                'domain' => 'atlantamovingcompany.com',
                'created_at' => '2025-08-06 20:21:39',
                'updated_at' => '2025-08-06 20:21:39',
            ]
        ];

        foreach ($companies as $companyData) {
            Company::firstOrCreate(['id' => $companyData['id']], $companyData);
        }

        // Create users
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@demo.com',
                'email_verified_at' => '2025-08-06 20:21:39',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'company_id' => 1,
                'created_at' => '2025-08-06 20:21:39',
                'updated_at' => '2025-08-06 20:21:39',
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@demo.com',
                'email_verified_at' => '2025-08-06 20:21:39',
                'password' => Hash::make('password'),
                'role' => 'user',
                'company_id' => 1,
                'created_at' => '2025-08-06 20:21:39',
                'updated_at' => '2025-08-06 20:21:39',
            ],
            [
                'name' => 'Atlanta Moving Admin',
                'email' => 'admin@atlantamovingcompany.com',
                'email_verified_at' => null,
                'password' => Hash::make('password'),
                'role' => 'admin',
                'company_id' => 2,
                'created_at' => '2025-08-06 20:21:40',
                'updated_at' => '2025-08-08 14:23:23',
            ],
            [
                'name' => 'System Administrator',
                'email' => 'admin@chalkleads.com',
                'email_verified_at' => '2025-08-08 13:56:02',
                'password' => Hash::make('password'),
                'role' => 'system_admin',
                'company_id' => null,
                'created_at' => '2025-08-08 13:56:02',
                'updated_at' => '2025-08-08 13:56:02',
            ]
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(['email' => $userData['email']], $userData);
        }

        // Create the Atlanta Moving Company widget
        $widgetData = [
            'company_id' => 2,
            'name' => 'Atlanta Moving - Complete Estimation Calculator',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Full Service & Labor Only Moving',
            'domain' => 'https://atlantamovingcompany.com',
            'company_name' => 'Atlanta Moving Company',
            'status' => 'published',
            'widget_key' => 'b6kDrhI6P8J6t8XhoRLH2zNiuyl7sD3H',
            'embed_domain' => null,
            'enabled_modules' => [
                "service-selection","service-type","location-type","project-scope","time-selection",
                "date-selection","origin-location","origin-challenges","target-location",
                "target-challenges","distance-calculation","additional-services","supply-selection",
                "contact-info","review-quote"
            ],
            'module_configs' => [
                'service-selection' => [
                    'title' => 'How can we help?',
                    'subtitle' => null,
                    'options' => [
                        [
                            'title' => 'Full Service Moving',
                            'description' => 'We bring the crew and the trucks',
                            'icon' => 'Truck',
                            'price_multiplier' => 1
                        ],
                        [
                            'title' => 'Labor Only Services',
                            'description' => 'Our professionals help you load and/or unload into your own truck',
                            'icon' => 'Users',
                            'price_multiplier' => 0.65
                        ]
                    ]
                ],
                'service-type' => [
                    'title' => 'What do you need help with?',
                    'subtitle' => 'Select the type of labor assistance you need',
                    'options' => [
                        [
                            'title' => 'Loading & Unloading',
                            'description' => 'Our crews help you load at a starting location and unload at a destination location',
                            'icon' => 'ArrowUpDown',
                            'price_multiplier' => 1
                        ],
                        [
                            'title' => 'Loading Only',
                            'description' => 'We help you load your items',
                            'icon' => 'ArrowUp',
                            'price_multiplier' => 0.6
                        ],
                        [
                            'title' => 'Unloading Only',
                            'description' => 'We help you unload previously loaded items',
                            'icon' => 'ArrowDown',
                            'price_multiplier' => 0.6
                        ]
                    ]
                ],
                'location-type' => [
                    'title' => 'What type of location?',
                    'subtitle' => 'Select the type of location you\'re moving between',
                    'options' => [
                        [
                            'title' => 'Residential',
                            'description' => 'Home, apartment, condo',
                            'icon' => 'Home',
                            'price_multiplier' => 1
                        ],
                        [
                            'title' => 'Commercial',
                            'description' => 'Office, retail, warehouse',
                            'icon' => 'Building',
                            'price_multiplier' => 1.25
                        ],
                        [
                            'title' => 'Storage Unit',
                            'description' => 'Self-storage facility',
                            'icon' => 'Archive',
                            'price_multiplier' => 0.85
                        ]
                    ]
                ],
                'project-scope' => [
                    'title' => 'What size is your move?',
                    'subtitle' => 'Select the size that best describes your move',
                    'options' => [
                        [
                            'title' => 'Studio',
                            'description' => 'Starting at $350',
                            'base_price' => 350,
                            'estimated_hours' => 3,
                            'price_range_min' => 298,
                            'price_range_max' => 508
                        ],
                        [
                            'title' => '1 Bedroom',
                            'description' => 'Starting at $475',
                            'base_price' => 475,
                            'estimated_hours' => 4,
                            'price_range_min' => 404,
                            'price_range_max' => 689
                        ],
                        [
                            'title' => '2 Bedroom',
                            'description' => 'Starting at $650',
                            'base_price' => 650,
                            'estimated_hours' => 5,
                            'price_range_min' => 553,
                            'price_range_max' => 943
                        ],
                        [
                            'title' => '3 Bedroom',
                            'description' => 'Starting at $825',
                            'base_price' => 825,
                            'estimated_hours' => 6.5,
                            'price_range_min' => 701,
                            'price_range_max' => 1196
                        ],
                        [
                            'title' => '4 Bedroom',
                            'description' => 'Starting at $1,050',
                            'base_price' => 1050,
                            'estimated_hours' => 8,
                            'price_range_min' => 893,
                            'price_range_max' => 1523
                        ],
                        [
                            'title' => '5+ Bedroom',
                            'description' => 'Starting at $1,300',
                            'base_price' => 1300,
                            'estimated_hours' => 10,
                            'price_range_min' => 1105,
                            'price_range_max' => 1885
                        ]
                    ]
                ],
                'contact-info' => [
                    'title' => 'Let\'s get your contact information',
                    'subtitle' => 'We\'ll contact you within 1 hour with your detailed quote'
                ],
                'review-quote' => [
                    'title' => 'Review Your Moving Quote',
                    'subtitle' => 'Here\'s your personalized estimate based on your selections'
                ]
            ],
            'branding' => [
                'primary_color' => '#1E40AF',
                'secondary_color' => '#1F2937'
            ],
            'settings' => [
                'tax_rate' => 0.08,
                'service_area_miles' => 100,
                'minimum_job_price' => 200,
                'show_price_ranges' => true
            ],
            'created_at' => '2025-08-06 20:21:40',
            'updated_at' => '2025-08-09 06:34:13',
            'pricing' => null
        ];

        Widget::firstOrCreate(['widget_key' => $widgetData['widget_key']], $widgetData);

        $this->command->info('Production data seeded successfully!');
    }
}