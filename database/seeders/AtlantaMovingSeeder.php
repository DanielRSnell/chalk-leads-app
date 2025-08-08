<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Widget;
use App\Models\WidgetPricing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AtlantaMovingSeeder extends Seeder
{
    public function run(): void
    {
        // Create Atlanta Moving Company with complete profile
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

        // Create admin user for Atlanta Moving
        $user = User::create([
            'name' => 'Atlanta Moving Admin',
            'email' => 'admin@atlantamovingcompany.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create the comprehensive moving widget with ALL original data
        $widget = Widget::create([
            'company_id' => $company->id,
            'name' => 'Atlanta Moving - Complete Widget (All Data)',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Full Service & Labor Only Moving',
            'domain' => 'atlantamovingcompany.com',
            'company_name' => 'Atlanta Moving Company',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',      // welcome
                'service-type',           // labor-type
                'location-type',          // move-type
                'project-scope',          // move-size
                'date-selection',         // date-selection
                'time-selection',         // time-selection
                'origin-location',        // pickup-location
                'origin-challenges',      // pickup-challenges
                'target-location',        // destination-location
                'target-challenges',      // destination-challenges
                'distance-calculation',   // route-distance
                'additional-services',    // additional-services
                'supply-inquiry',         // moving-supplies-question
                'supply-selection',       // moving-supplies-selection
                'contact-info',           // contact
                'review-quote',           // review-details
                'chat-integration'        // voiceflow-screen
            ],
            'module_configs' => [
                // Module 1: Welcome/Service Selection
                'service-selection' => [
                    'title' => 'How can we help?',
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
                
                // Module 2: Labor Type (conditional)
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
                
                // Module 3: Location Type
                'location-type' => [
                    'title' => 'What type of location?',
                    'subtitle' => 'Select the type of location you\'re moving between',
                    'options' => [
                        [
                            'title' => 'Residential',
                            'description' => 'Home, apartment, condo',
                            'icon' => 'Home'
                        ],
                        [
                            'title' => 'Commercial',
                            'description' => 'Office, retail, warehouse',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Storage Unit',
                            'description' => 'Self-storage facility',
                            'icon' => 'Archive'
                        ]
                    ]
                ],
                
                // Module 4: Move Size with EXACT pricing
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
                
                // Module 5: Date Selection
                'date-selection' => [
                    'title' => 'When do you need to move?',
                    'subtitle' => 'Select your preferred moving date'
                ],
                
                // Module 6: Time Selection with pricing
                'time-selection' => [
                    'title' => 'What\'s your preferred start time?',
                    'subtitle' => 'Choose the time window that works best for you',
                    'options' => [
                        [
                            'title' => 'Morning',
                            'description' => '8AM—12PM',
                            'icon' => 'Sunrise'
                        ],
                        [
                            'title' => 'Afternoon',
                            'description' => '12PM—4PM',
                            'icon' => 'Sun'
                        ],
                        [
                            'title' => 'Evening',
                            'description' => '4PM—8PM (15% premium)',
                            'icon' => 'Sunset'
                        ]
                    ]
                ],
                
                // Module 7: Origin Location
                'origin-location' => [
                    'title' => 'Where are you moving from?',
                    'subtitle' => 'Enter your pickup location so we can provide accurate pricing and logistics',
                    'address_label' => 'Pickup Address'
                ],
                
                // Module 8: Origin Challenges with EXACT pricing
                'origin-challenges' => [
                    'title' => 'Pickup Location Challenges',
                    'subtitle' => 'Help us prepare the right equipment and crew for your pickup location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Additional $45 per flight (max 10 flights)',
                            'icon' => 'ArrowUp'
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => '5% discount when elevator is available',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Fixed $85 fee for narrow doorway complications',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => '15% increase for long distance from parking',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => '12% increase for heavy/bulky items',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Fixed $125 fee for extra care with fragile items',
                            'icon' => 'AlertTriangle'
                        ]
                    ]
                ],
                
                // Module 9: Target Location
                'target-location' => [
                    'title' => 'Where are you moving to?',
                    'subtitle' => 'Enter your destination address to complete the route planning',
                    'address_label' => 'Destination Address'
                ],
                
                // Module 10: Target Challenges (same pricing as origin)
                'target-challenges' => [
                    'title' => 'Destination Challenges',
                    'subtitle' => 'Help us prepare for any challenges at your destination location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Additional $45 per flight (max 10 flights)',
                            'icon' => 'ArrowUp'
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => '5% discount when elevator is available',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Fixed $85 fee for narrow doorway complications',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => '15% increase for long distance from parking',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => '12% increase for heavy/bulky items',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Fixed $125 fee for extra care with fragile items',
                            'icon' => 'AlertTriangle'
                        ]
                    ]
                ],
                
                // Module 11: Distance Calculation
                'distance-calculation' => [
                    'title' => 'Route Calculation',
                    'subtitle' => 'Calculating driving distance between your pickup and destination locations ($4.00 per mile)'
                ],
                
                // Module 12: Additional Services with EXACT pricing
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
                
                // Module 13: Supply Inquiry
                'supply-inquiry' => [
                    'title' => 'Do you need moving supplies?',
                    'subtitle' => 'We offer high-quality packing supplies delivered to your door',
                    'supply_type' => 'moving supplies'
                ],
                
                // Module 14: Supply Selection with COMPLETE inventory
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
                
                // Module 15: Contact Info
                'contact-info' => [
                    'title' => 'Let\'s get your contact information',
                    'subtitle' => 'We\'ll contact you within 1 hour with your detailed quote'
                ],
                
                // Module 16: Review Quote
                'review-quote' => [
                    'title' => 'Review Your Moving Quote',
                    'subtitle' => 'Here\'s your personalized estimate based on your selections'
                ],
                
                // Module 17: Chat Integration
                'chat-integration' => [
                    'title' => 'Chat with Our Moving Expert',
                    'subtitle' => 'Get instant answers to your moving questions',
                    'service_type' => 'moving'
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
                'service_area_miles' => 100
            ]
        ]);

        // Create COMPLETE base rates pricing (exact from base-rates.json)
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

        // Create COMPLETE challenge modifiers (exact from challenge-modifiers.json)
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

        // Create supply catalog pricing (exact from categories.json)
        WidgetPricing::create([
            'widget_id' => $widget->id,
            'category' => 'supply_catalog',
            'pricing_rules' => [
                'boxes' => [
                    'small-box' => ['price' => 2.50, 'name' => 'Small Box', 'dimensions' => '16" x 12" x 12"'],
                    'medium-box' => ['price' => 3.25, 'name' => 'Medium Box', 'dimensions' => '18" x 14" x 12"'],
                    'large-box' => ['price' => 4.75, 'name' => 'Large Box', 'dimensions' => '20" x 20" x 15"'],
                    'wardrobe-box' => ['price' => 12.99, 'name' => 'Wardrobe Box', 'dimensions' => '24" x 20" x 46"']
                ],
                'packing-materials' => [
                    'packing-tape' => ['price' => 4.99, 'name' => 'Packing Tape', 'dimensions' => '2" x 55 yards'],
                    'bubble-wrap' => ['price' => 8.99, 'name' => 'Bubble Wrap', 'dimensions' => '12" x 25 feet'],
                    'packing-paper' => ['price' => 12.99, 'name' => 'Packing Paper', 'dimensions' => '24" x 36" (25 lbs)'],
                    'markers' => ['price' => 6.99, 'name' => 'Permanent Markers', 'dimensions' => 'Pack of 4']
                ],
                'furniture-protection' => [
                    'furniture-pads' => ['price' => 15.99, 'name' => 'Furniture Pads', 'dimensions' => '72" x 80"'],
                    'mattress-covers' => ['price' => 8.99, 'name' => 'Mattress Covers', 'dimensions' => 'Queen/King size'],
                    'stretch-wrap' => ['price' => 11.99, 'name' => 'Stretch Wrap', 'dimensions' => '18" x 1500 feet']
                ],
                'specialty-items' => [
                    'dish-pack' => ['price' => 24.99, 'name' => 'Dish Pack Kit', 'dimensions' => 'Kit with dividers'],
                    'picture-boxes' => ['price' => 18.99, 'name' => 'Picture Boxes', 'dimensions' => 'Adjustable up to 40"'],
                    'tv-box' => ['price' => 29.99, 'name' => 'TV Moving Box', 'dimensions' => 'Up to 65" TV']
                ]
            ]
        ]);

        $this->command->info('✅ Created COMPLETE Atlanta Moving Company with ALL original data:');
        $this->command->info("   - Company: {$company->name}");
        $this->command->info("   - User: admin@atlantamovingcompany.com (password)");
        $this->command->info("   - Widget: {$widget->name}");
        $this->command->info("   - Widget Key: {$widget->widget_key}");
        $this->command->info("   - Total Modules: " . count($widget->enabled_modules) . " (ALL 17 modules)");
        $this->command->info("   - Pricing Categories: " . $widget->pricing->count() . " (base_rates, challenge_modifiers, supply_catalog)");
        $this->command->info("   - Supply Items: 16 items across 4 categories with exact pricing");
        $this->command->info("   - Challenge Modifiers: 8 challenges + 5 additional services + distance tiers");
        $this->command->info("   - API Endpoint: /api/widget/{$widget->widget_key}/config");
    }
}