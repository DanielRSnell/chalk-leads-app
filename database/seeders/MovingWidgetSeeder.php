<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Widget;
use App\Models\WidgetPricing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MovingWidgetSeeder extends Seeder
{
    public function run(): void
    {
        // Create a demo company for the moving widget
        $company = Company::create([
            'name' => 'Premier Moving Services',
            'domain' => 'premiermovingservices.com',
            'settings' => [
                'timezone' => 'America/New_York',
                'phone' => '(555) 123-4567',
                'email' => 'info@premiermovingservices.com',
                'address' => '123 Moving Street, Chicago, IL 60601'
            ]
        ]);

        // Create a demo user for this company
        $user = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@premiermovingservices.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create the comprehensive moving widget with all modules and real data
        $widget = Widget::create([
            'company_id' => $company->id,
            'name' => 'Complete Moving Services Widget',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Full Service & Labor Only Moving',
            'domain' => 'premiermovingservices.com',
            'company_name' => 'Premier Moving Services',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',
                'service-type',
                'project-scope',
                'timeline-planning',
                'location-services',
                'additional-services',
                'contact-info',
                'review-quote'
            ],
            'module_configs' => [
                'service-selection' => [
                    'title' => 'How can we help you today?',
                    'subtitle' => null,
                    'options' => [
                        [
                            'title' => 'Full Service Moving',
                            'description' => 'We bring the crew and the trucks',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Labor Only Services',
                            'description' => 'Our professionals help you load and/or unload into your own truck',
                            'icon' => 'Users'
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
                            'icon' => 'ArrowUpDown'
                        ],
                        [
                            'title' => 'Loading Only',
                            'description' => 'We help you load your items',
                            'icon' => 'ArrowUp'
                        ],
                        [
                            'title' => 'Unloading Only',
                            'description' => 'We help you unload previously loaded items',
                            'icon' => 'ArrowDown'
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
                            'price_modifier' => 350
                        ],
                        [
                            'title' => '1 Bedroom',
                            'description' => 'Starting at $475',
                            'price_modifier' => 475
                        ],
                        [
                            'title' => '2 Bedroom',
                            'description' => 'Starting at $650',
                            'price_modifier' => 650
                        ],
                        [
                            'title' => '3 Bedroom',
                            'description' => 'Starting at $825',
                            'price_modifier' => 825
                        ],
                        [
                            'title' => '4 Bedroom',
                            'description' => 'Starting at $1,050',
                            'price_modifier' => 1050
                        ],
                        [
                            'title' => '5+ Bedroom',
                            'description' => 'Starting at $1,300',
                            'price_modifier' => 1300
                        ]
                    ]
                ],
                'timeline-planning' => [
                    'title' => 'When do you need to move?',
                    'subtitle' => 'Select your preferred moving date and time',
                    'options' => [
                        [
                            'title' => 'Morning (8am-12pm)',
                            'description' => 'Standard morning hours'
                        ],
                        [
                            'title' => 'Afternoon (12pm-5pm)',
                            'description' => 'Standard afternoon hours'
                        ],
                        [
                            'title' => 'Evening (5pm-8pm)',
                            'description' => 'Evening hours - 15% premium'
                        ]
                    ]
                ],
                'location-services' => [
                    'title' => 'Location Information',
                    'subtitle' => 'Help us provide accurate pricing and logistics',
                    'options' => [
                        [
                            'title' => 'Pickup Location',
                            'description' => 'Enter your current address',
                            'icon' => 'MapPin'
                        ],
                        [
                            'title' => 'Destination Location',
                            'description' => 'Where are you moving to?',
                            'icon' => 'Navigation'
                        ]
                    ]
                ],
                'additional-services' => [
                    'title' => 'Any additional services?',
                    'subtitle' => 'Select any additional services you might need',
                    'options' => [
                        [
                            'title' => 'Packing Services',
                            'description' => 'Professional packing of your belongings (25% additional)',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'Moving Insurance',
                            'description' => 'Additional protection for your items (8% additional)',
                            'icon' => 'Shield'
                        ],
                        [
                            'title' => 'Furniture Disassembly',
                            'description' => 'Take apart and reassemble furniture (+$200)',
                            'icon' => 'Wrench'
                        ],
                        [
                            'title' => 'Storage Service',
                            'description' => 'Temporary storage for your items (+$150)',
                            'icon' => 'Archive'
                        ],
                        [
                            'title' => 'Cleaning Service',
                            'description' => 'Post-move cleaning service (+$175)',
                            'icon' => 'Home'
                        ]
                    ]
                ],
                'contact-info' => [
                    'title' => 'Let\'s get your contact information',
                    'subtitle' => 'We\'ll use this to send you your personalized quote'
                ],
                'review-quote' => [
                    'title' => 'Review Your Moving Quote',
                    'subtitle' => 'Here\'s your personalized estimate based on your selections'
                ]
            ],
            'branding' => [
                'primary_color' => '#1E40AF',
                'secondary_color' => '#1F2937',
                'logo_url' => null
            ],
            'settings' => [
                'google_maps_api_key' => null,
                'lead_notifications' => true,
                'thank_you_message' => 'Thank you for choosing Premier Moving Services! We\'ll contact you within 1 hour with your detailed quote.',
                'redirect_url' => null
            ]
        ]);

        // Create comprehensive pricing rules for the moving widget
        WidgetPricing::create([
            'widget_id' => $widget->id,
            'category' => 'base_rates',
            'pricing_rules' => [
                'moveSize' => [
                    'studio' => [
                        'basePrice' => 350,
                        'hours' => 3,
                        'description' => 'Studio apartment - basic move'
                    ],
                    '1-bedroom' => [
                        'basePrice' => 475,
                        'hours' => 4,
                        'description' => '1 bedroom apartment/home'
                    ],
                    '2-bedroom' => [
                        'basePrice' => 650,
                        'hours' => 5,
                        'description' => '2 bedroom apartment/home'
                    ],
                    '3-bedroom' => [
                        'basePrice' => 825,
                        'hours' => 6.5,
                        'description' => '3 bedroom apartment/home'
                    ],
                    '4-bedroom' => [
                        'basePrice' => 1050,
                        'hours' => 8,
                        'description' => '4 bedroom apartment/home'
                    ],
                    '5-bedroom+' => [
                        'basePrice' => 1300,
                        'hours' => 10,
                        'description' => '5+ bedroom apartment/home'
                    ]
                ],
                'serviceType' => [
                    'full-service' => [
                        'multiplier' => 1.0,
                        'description' => 'Full service moving with crew and trucks'
                    ],
                    'labor-only' => [
                        'multiplier' => 0.65,
                        'description' => 'Labor only services - customer provides truck'
                    ]
                ],
                'laborType' => [
                    'loading-unloading' => [
                        'multiplier' => 1.0,
                        'description' => 'Complete loading and unloading service'
                    ],
                    'loading-only' => [
                        'multiplier' => 0.6,
                        'description' => 'Loading service only'
                    ],
                    'unloading-only' => [
                        'multiplier' => 0.6,
                        'description' => 'Unloading service only'
                    ]
                ],
                'timeWindow' => [
                    'morning' => [
                        'multiplier' => 1.0,
                        'description' => 'Standard morning hours'
                    ],
                    'afternoon' => [
                        'multiplier' => 1.0,
                        'description' => 'Standard afternoon hours'
                    ],
                    'evening' => [
                        'multiplier' => 1.15,
                        'description' => 'Evening hours - 15% premium'
                    ]
                ],
                'distance' => [
                    'costPerMile' => 4.00,
                    'minimumDistance' => 0,
                    'description' => 'Mileage charge for travel between pickup and destination'
                ]
            ]
        ]);

        WidgetPricing::create([
            'widget_id' => $widget->id,
            'category' => 'challenge_modifiers',
            'pricing_rules' => [
                'challenges' => [
                    'stairs' => [
                        'type' => 'per_flight',
                        'baseModifier' => 45,
                        'description' => 'Additional cost per flight of stairs',
                        'maxFlights' => 10
                    ],
                    'elevator' => [
                        'type' => 'discount',
                        'modifier' => -0.05,
                        'description' => '5% discount when elevator is available'
                    ],
                    'narrow_doorway' => [
                        'type' => 'fixed',
                        'modifier' => 85,
                        'description' => 'Fixed fee for narrow doorway complications'
                    ],
                    'parking_distance' => [
                        'type' => 'percentage',
                        'modifier' => 0.15,
                        'description' => '15% increase for long distance from parking'
                    ],
                    'heavy_items' => [
                        'type' => 'percentage',
                        'modifier' => 0.12,
                        'description' => '12% increase for heavy/bulky items'
                    ],
                    'fragile_items' => [
                        'type' => 'fixed',
                        'modifier' => 125,
                        'description' => 'Fixed fee for extra care with fragile items'
                    ],
                    'assembly_required' => [
                        'type' => 'fixed',
                        'modifier' => 150,
                        'description' => 'Furniture assembly/disassembly service'
                    ],
                    'fragile_placement' => [
                        'type' => 'fixed',
                        'modifier' => 75,
                        'description' => 'Careful placement of delicate items'
                    ]
                ],
                'additionalServices' => [
                    'packing' => [
                        'type' => 'percentage',
                        'modifier' => 0.25,
                        'description' => '25% increase for packing services'
                    ],
                    'insurance' => [
                        'type' => 'percentage',
                        'modifier' => 0.08,
                        'description' => '8% increase for additional insurance coverage'
                    ],
                    'disassembly' => [
                        'type' => 'fixed',
                        'modifier' => 200,
                        'description' => 'Furniture disassembly and reassembly service'
                    ],
                    'storage' => [
                        'type' => 'fixed',
                        'modifier' => 150,
                        'description' => 'Temporary storage service'
                    ],
                    'cleaning' => [
                        'type' => 'fixed',
                        'modifier' => 175,
                        'description' => 'Post-move cleaning service'
                    ]
                ],
                'distance' => [
                    'local' => [
                        'range' => '0-25 miles',
                        'multiplier' => 1.0,
                        'description' => 'Local move within 25 miles'
                    ],
                    'regional' => [
                        'range' => '26-100 miles',
                        'multiplier' => 1.35,
                        'description' => 'Regional move 26-100 miles'
                    ],
                    'long_distance' => [
                        'range' => '100+ miles',
                        'multiplier' => 2.0,
                        'description' => 'Long distance move over 100 miles'
                    ]
                ]
            ]
        ]);

        $this->command->info('✅ Created comprehensive moving widget seeder with:');
        $this->command->info("   - Company: {$company->name}");
        $this->command->info("   - User: {$user->name} ({$user->email})");
        $this->command->info("   - Widget: {$widget->name}");
        $this->command->info("   - Widget Key: {$widget->widget_key}");
        $this->command->info("   - Modules: " . count($widget->enabled_modules) . " modules configured");
        $this->command->info("   - Pricing Rules: " . $widget->pricing->count() . " pricing categories");
        $this->command->info("   - API Endpoint: /api/widget/{$widget->widget_key}/config");
    }
}