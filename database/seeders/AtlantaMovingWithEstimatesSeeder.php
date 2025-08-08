<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Widget;
use App\Models\WidgetPricing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AtlantaMovingWithEstimatesSeeder extends Seeder
{
    public function run(): void
    {
        // Create Atlanta Moving Company
        $company = Company::create([
            'name' => 'Atlanta Moving Company',
            'domain' => 'atlantamovingcompany.com',
            'settings' => [
                'timezone' => 'America/New_York',
                'phone' => '(404) 555-MOVE',
                'email' => 'info@atlantamovingcompany.com',
                'address' => '1234 Peachtree Street, Atlanta, GA 30309',
                'service_area' => 'Metro Atlanta and surrounding areas',
                'hours' => 'Mon-Sun: 7AM-7PM',
                'license' => 'GA DOT#12345',
                'insurance' => 'Full liability and cargo insurance'
            ]
        ]);

        // Create admin user
        $user = User::create([
            'name' => 'Atlanta Moving Admin',
            'email' => 'admin@atlantamovingcompany.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create the widget with COMPLETE estimation values
        $widget = Widget::create([
            'company_id' => $company->id,
            'name' => 'Atlanta Moving - Complete Estimation Calculator',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Full Service & Labor Only Moving',
            'domain' => 'atlantamovingcompany.com',
            'company_name' => 'Atlanta Moving Company',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',
                'service-type',
                'location-type',
                'project-scope',
                'time-selection',
                'origin-location',
                'origin-challenges',
                'target-location',
                'target-challenges',
                'distance-calculation',
                'additional-services',
                'supply-selection',
                'contact-info',
                'review-quote'
            ],
            'module_configs' => [
                // Service Selection with multipliers
                'service-selection' => [
                    'title' => 'How can we help?',
                    'subtitle' => null,
                    'options' => [
                        [
                            'title' => 'Full Service Moving',
                            'description' => 'We bring the crew and the trucks',
                            'icon' => 'Truck',
                            'price_multiplier' => 1.0
                        ],
                        [
                            'title' => 'Labor Only Services',
                            'description' => 'Our professionals help you load and/or unload into your own truck',
                            'icon' => 'Users',
                            'price_multiplier' => 0.65
                        ]
                    ]
                ],
                
                // Service Type with exact multipliers from base-rates.json
                'service-type' => [
                    'title' => 'What do you need help with?',
                    'subtitle' => 'Select the type of labor assistance you need',
                    'options' => [
                        [
                            'title' => 'Loading & Unloading',
                            'description' => 'Our crews help you load at a starting location and unload at a destination location',
                            'icon' => 'ArrowUpDown',
                            'price_multiplier' => 1.0
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
                
                // Location Type from original move-type.json
                'location-type' => [
                    'title' => 'What type of location?',
                    'subtitle' => 'Select the type of location you\'re moving between',
                    'options' => [
                        [
                            'title' => 'Residential',
                            'description' => 'Home, apartment, condo',
                            'icon' => 'Home',
                            'price_multiplier' => 1.0
                        ],
                        [
                            'title' => 'Commercial',
                            'description' => 'Office, retail, warehouse',
                            'icon' => 'Building',
                            'price_multiplier' => 1.25 // 25% increase for commercial
                        ],
                        [
                            'title' => 'Storage Unit',
                            'description' => 'Self-storage facility',
                            'icon' => 'Archive',
                            'price_multiplier' => 0.85 // 15% discount for storage
                        ]
                    ]
                ],
                
                // Project Scope with EXACT pricing from base-rates.json
                'project-scope' => [
                    'title' => 'What size is your move?',
                    'subtitle' => 'Select the size that best describes your move',
                    'options' => [
                        [
                            'title' => 'Studio',
                            'description' => 'Starting at $350',
                            'base_price' => 350,
                            'estimated_hours' => 3,
                            'price_range_min' => 298, // 15% below base
                            'price_range_max' => 508  // 45% above base
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
                
                // Time Selection with premiums
                'time-selection' => [
                    'title' => 'What\'s your preferred start time?',
                    'subtitle' => 'Choose the time window that works best for you',
                    'options' => [
                        [
                            'title' => 'Morning',
                            'description' => '8AM—12PM',
                            'icon' => 'Sunrise',
                            'price_multiplier' => 1.0
                        ],
                        [
                            'title' => 'Afternoon',
                            'description' => '12PM—4PM',
                            'icon' => 'Sun',
                            'price_multiplier' => 1.0
                        ],
                        [
                            'title' => 'Evening',
                            'description' => '4PM—8PM (15% premium)',
                            'icon' => 'Sunset',
                            'price_multiplier' => 1.15
                        ]
                    ]
                ],
                
                // Origin Location
                'origin-location' => [
                    'title' => 'Where are you moving from?',
                    'subtitle' => 'Enter your pickup location so we can provide accurate pricing and logistics',
                    'address_label' => 'Pickup Address'
                ],
                
                // Origin Challenges with EXACT pricing from challenge-modifiers.json
                'origin-challenges' => [
                    'title' => 'Pickup Location Challenges',
                    'subtitle' => 'Help us prepare the right equipment and crew for your pickup location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Additional $45 per flight (max 10 flights)',
                            'icon' => 'ArrowUp',
                            'pricing_type' => 'per_unit',
                            'pricing_value' => 45,
                            'max_units' => 10
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => '5% discount when elevator is available',
                            'icon' => 'Building',
                            'pricing_type' => 'discount',
                            'pricing_value' => -0.05
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Fixed $85 fee for narrow doorway complications',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 85
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => '15% increase for long distance from parking',
                            'icon' => 'Truck',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.15
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => '12% increase for heavy/bulky items',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.12
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Fixed $125 fee for extra care with fragile items',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 125
                        ]
                    ]
                ],
                
                // Target Location
                'target-location' => [
                    'title' => 'Where are you moving to?',
                    'subtitle' => 'Enter your destination address to complete the route planning',
                    'address_label' => 'Destination Address'
                ],
                
                // Target Challenges (same as origin)
                'target-challenges' => [
                    'title' => 'Destination Challenges',
                    'subtitle' => 'Help us prepare for any challenges at your destination location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Additional $45 per flight (max 10 flights)',
                            'icon' => 'ArrowUp',
                            'pricing_type' => 'per_unit',
                            'pricing_value' => 45,
                            'max_units' => 10
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => '5% discount when elevator is available',
                            'icon' => 'Building',
                            'pricing_type' => 'discount',
                            'pricing_value' => -0.05
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Fixed $85 fee for narrow doorway complications',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 85
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => '15% increase for long distance from parking',
                            'icon' => 'Truck',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.15
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => '12% increase for heavy/bulky items',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.12
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Fixed $125 fee for extra care with fragile items',
                            'icon' => 'AlertTriangle',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 125
                        ]
                    ]
                ],
                
                // Distance Calculation with exact pricing
                'distance-calculation' => [
                    'title' => 'Route Calculation',
                    'subtitle' => 'Calculating driving distance between your pickup and destination locations',
                    'cost_per_mile' => 4.00,
                    'minimum_distance' => 0
                ],
                
                // Additional Services with EXACT pricing from challenge-modifiers.json
                'additional-services' => [
                    'title' => 'Any additional services?',
                    'subtitle' => 'Select any additional services you might need',
                    'options' => [
                        [
                            'title' => 'Packing Services',
                            'description' => 'Professional packing of your belongings (25% additional)',
                            'icon' => 'Package',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.25
                        ],
                        [
                            'title' => 'Moving Insurance',
                            'description' => 'Additional protection for your items (8% additional)',
                            'icon' => 'Shield',
                            'pricing_type' => 'percentage',
                            'pricing_value' => 0.08
                        ],
                        [
                            'title' => 'Furniture Disassembly',
                            'description' => 'Take apart and reassemble furniture (+$200)',
                            'icon' => 'Wrench',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 200
                        ],
                        [
                            'title' => 'Storage Service',
                            'description' => 'Temporary storage for your items (+$150)',
                            'icon' => 'Archive',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 150
                        ],
                        [
                            'title' => 'Cleaning Service',
                            'description' => 'Post-move cleaning service (+$175)',
                            'icon' => 'Home',
                            'pricing_type' => 'fixed',
                            'pricing_value' => 175
                        ]
                    ]
                ],
                
                // Supply Selection with EXACT pricing from categories.json
                'supply-selection' => [
                    'title' => 'Select Moving Supplies',
                    'subtitle' => 'Choose from our professional moving supplies',
                    'categories' => [
                        [
                            'name' => 'Moving Boxes',
                            'description' => 'Various sizes of moving boxes for your belongings',
                            'icon' => 'Package',
                            'items' => [
                                ['name' => 'Small Box', 'description' => 'Perfect for books and heavy items (16" x 12" x 12")', 'price' => 2.50],
                                ['name' => 'Medium Box', 'description' => 'Great for clothes and kitchen items (18" x 14" x 12")', 'price' => 3.25],
                                ['name' => 'Large Box', 'description' => 'Ideal for linens and lightweight items (20" x 20" x 15")', 'price' => 4.75],
                                ['name' => 'Wardrobe Box', 'description' => 'Hanging clothes box with bar (24" x 20" x 46")', 'price' => 12.99]
                            ]
                        ],
                        [
                            'name' => 'Packing Materials',
                            'description' => 'Essential materials to protect your items',
                            'icon' => 'Shield',
                            'items' => [
                                ['name' => 'Packing Tape', 'description' => 'Heavy-duty adhesive tape (2" x 55 yards)', 'price' => 4.99],
                                ['name' => 'Bubble Wrap', 'description' => 'Protective bubble wrap (12" x 25 feet)', 'price' => 8.99],
                                ['name' => 'Packing Paper', 'description' => 'Newsprint packing paper (24" x 36" - 25 lbs)', 'price' => 12.99],
                                ['name' => 'Permanent Markers', 'description' => 'Pack of 4 black markers', 'price' => 6.99]
                            ]
                        ],
                        [
                            'name' => 'Furniture Protection',
                            'description' => 'Protect your furniture during the move',
                            'icon' => 'Home',
                            'items' => [
                                ['name' => 'Furniture Pads', 'description' => 'Heavy-duty moving blankets (72" x 80")', 'price' => 15.99],
                                ['name' => 'Mattress Covers', 'description' => 'Plastic mattress protectors (Queen/King size)', 'price' => 8.99],
                                ['name' => 'Stretch Wrap', 'description' => 'Industrial strength plastic wrap (18" x 1500 feet)', 'price' => 11.99]
                            ]
                        ],
                        [
                            'name' => 'Specialty Items',
                            'description' => 'Specialized packing for fragile items',
                            'icon' => 'Star',
                            'items' => [
                                ['name' => 'Dish Pack Kit', 'description' => 'Complete kit for dishes and glassware', 'price' => 24.99],
                                ['name' => 'Picture Boxes', 'description' => 'Adjustable boxes for artwork (up to 40")', 'price' => 18.99],
                                ['name' => 'TV Moving Box', 'description' => 'Custom box for flat screen TVs (up to 65")', 'price' => 29.99]
                            ]
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
                'secondary_color' => '#1F2937',
                'logo_url' => null
            ],
            'settings' => [
                'google_maps_api_key' => null,
                'lead_notifications' => true,
                'thank_you_message' => 'Thank you for choosing Atlanta Moving Company! We\'ll contact you within 1 hour with your detailed quote.',
                'redirect_url' => null,
                'tax_rate' => 0.08, // 8% tax rate for Georgia
                'service_area_miles' => 100,
                'minimum_job_price' => 200,
                'show_price_ranges' => true
            ]
        ]);

        $this->command->info('✅ Created Atlanta Moving Company with COMPLETE estimation calculator:');
        $this->command->info("   - Company: {$company->name}");
        $this->command->info("   - User: admin@atlantamovingcompany.com (password)");
        $this->command->info("   - Widget: {$widget->name}");
        $this->command->info("   - Widget Key: {$widget->widget_key}");
        $this->command->info("   - Total Modules: " . count($widget->enabled_modules) . " with full estimation values");
        $this->command->info("   - API Endpoint: /api/widget/{$widget->widget_key}/config");
        $this->command->info("   - All estimation fields populated for real-time calculation");
    }
}