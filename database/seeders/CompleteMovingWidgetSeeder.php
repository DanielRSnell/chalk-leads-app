<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Widget;
use App\Models\WidgetPricing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CompleteMovingWidgetSeeder extends Seeder
{
    public function run(): void
    {
        // Create a demo company for the comprehensive moving widget
        $company = Company::create([
            'name' => 'MoovinLeads Moving Services',
            'domain' => 'moovinleads.com',
            'settings' => [
                'timezone' => 'America/New_York',
                'phone' => '(555) 123-MOVE',
                'email' => 'info@moovinleads.com',
                'address' => '123 Moving Boulevard, Chicago, IL 60601'
            ]
        ]);

        // Create a demo user for this company
        $user = User::create([
            'name' => 'Mike Rodriguez',
            'email' => 'mike@moovinleads.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create the COMPLETE moving widget with ALL 17 original modules
        $widget = Widget::create([
            'company_id' => $company->id,
            'name' => 'Complete MoovinLeads Widget (All 17 Modules)',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Complete Moving Experience',
            'domain' => 'moovinleads.com',
            'company_name' => 'MoovinLeads Moving Services',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',        // welcome
                'labor-type',               // labor-type
                'move-type',                // move-type
                'project-scope',            // move-size
                'date-selection',           // date-selection
                'time-selection',           // time-selection
                'pickup-location',          // pickup-location
                'pickup-challenges',        // pickup-challenges
                'destination-location',     // destination-location
                'destination-challenges',   // destination-challenges
                'route-distance',           // route-distance
                'additional-services',      // additional-services
                'moving-supplies-question', // moving-supplies-question
                'moving-supplies-selection',// moving-supplies-selection
                'contact-info',             // contact
                'review-quote',             // review-details
                'voiceflow-screen'          // voiceflow-screen
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
                
                // Module 2: Labor Type (conditional on labor-only selection)
                'labor-type' => [
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
                
                // Module 3: Move Type (Location Type)
                'move-type' => [
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
                
                // Module 4: Move Size (Project Scope)
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
                
                // Module 5: Date Selection (Calendar)
                'date-selection' => [
                    'title' => 'When do you need to move?',
                    'subtitle' => 'Select your preferred moving date',
                    'options' => [
                        [
                            'title' => 'Calendar Selection',
                            'description' => 'Choose your preferred moving date',
                            'icon' => 'Calendar'
                        ]
                    ]
                ],
                
                // Module 6: Time Selection
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
                            'description' => '4PM—8PM',
                            'icon' => 'Sunset'
                        ]
                    ]
                ],
                
                // Module 7: Pickup Location
                'pickup-location' => [
                    'title' => 'Where are you moving from?',
                    'subtitle' => 'Enter your pickup location so we can provide accurate pricing and logistics',
                    'options' => [
                        [
                            'title' => 'Pickup Address',
                            'description' => 'Enter your current address for pickup',
                            'icon' => 'MapPin'
                        ]
                    ]
                ],
                
                // Module 8: Pickup Challenges
                'pickup-challenges' => [
                    'title' => 'Pickup Location Challenges',
                    'subtitle' => 'Help us prepare the right equipment and crew for your pickup location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Number of flights of stairs',
                            'icon' => 'ArrowUp'
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => 'Elevator access for moving items',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Doorways that may cause difficulty',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => 'Parking far from entrance',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => 'Items requiring special handling',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Items requiring extra care',
                            'icon' => 'AlertTriangle'
                        ]
                    ]
                ],
                
                // Module 9: Destination Location
                'destination-location' => [
                    'title' => 'Where are you moving to?',
                    'subtitle' => 'Enter your destination address to complete the route planning',
                    'options' => [
                        [
                            'title' => 'Destination Address',
                            'description' => 'Enter your destination address',
                            'icon' => 'Navigation'
                        ]
                    ]
                ],
                
                // Module 10: Destination Challenges
                'destination-challenges' => [
                    'title' => 'Destination Challenges',
                    'subtitle' => 'Help us prepare for any challenges at your destination location',
                    'options' => [
                        [
                            'title' => 'Stairs (flights)',
                            'description' => 'Number of flights of stairs',
                            'icon' => 'ArrowUp'
                        ],
                        [
                            'title' => 'Elevator available',
                            'description' => 'Elevator access for moving items',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Narrow doorways',
                            'description' => 'Doorways that may cause difficulty',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Long distance from parking',
                            'description' => 'Parking far from entrance',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Heavy/bulky items',
                            'description' => 'Items requiring special handling',
                            'icon' => 'AlertTriangle'
                        ],
                        [
                            'title' => 'Fragile items',
                            'description' => 'Items requiring extra care',
                            'icon' => 'AlertTriangle'
                        ]
                    ]
                ],
                
                // Module 11: Route Distance Calculation
                'route-distance' => [
                    'title' => 'Route Calculation',
                    'subtitle' => 'Calculating driving distance between your pickup and destination locations',
                    'options' => [
                        [
                            'title' => 'Distance Calculation',
                            'description' => 'Automatic route and distance calculation',
                            'icon' => 'Navigation'
                        ]
                    ]
                ],
                
                // Module 12: Additional Services
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
                
                // Module 13: Moving Supplies Question
                'moving-supplies-question' => [
                    'title' => 'Do you need moving supplies?',
                    'subtitle' => 'We offer high-quality packing supplies delivered to your door',
                    'options' => [
                        [
                            'title' => 'Yes, I need supplies',
                            'description' => 'Browse our selection of moving supplies',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'No, I have my own',
                            'description' => 'I already have all necessary packing supplies',
                            'icon' => 'X'
                        ]
                    ]
                ],
                
                // Module 14: Moving Supplies Selection
                'moving-supplies-selection' => [
                    'title' => 'Select Moving Supplies',
                    'subtitle' => 'Choose from our selection of high-quality moving supplies',
                    'options' => [
                        [
                            'title' => 'Moving Boxes',
                            'description' => 'Various sizes of moving boxes',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'Packing Materials',
                            'description' => 'Bubble wrap, packing paper, tape',
                            'icon' => 'Archive'
                        ],
                        [
                            'title' => 'Specialty Items',
                            'description' => 'Wardrobe boxes, mattress covers',
                            'icon' => 'Shield'
                        ]
                    ]
                ],
                
                // Module 15: Contact Information
                'contact-info' => [
                    'title' => 'Let\'s get your contact information',
                    'subtitle' => 'We\'ll use this to send you your personalized quote'
                ],
                
                // Module 16: Review Details & Quote
                'review-quote' => [
                    'title' => 'Review Your Moving Details',
                    'subtitle' => 'Here\'s your personalized estimate based on your selections'
                ],
                
                // Module 17: Voiceflow Screen
                'voiceflow-screen' => [
                    'title' => 'Chat with Our Moving Expert',
                    'subtitle' => 'Get instant answers to your moving questions',
                    'options' => [
                        [
                            'title' => 'Start Chat',
                            'description' => 'Chat with our AI moving assistant',
                            'icon' => 'MessageCircle'
                        ]
                    ]
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
                'thank_you_message' => 'Thank you for choosing MoovinLeads! We\'ll contact you within 30 minutes with your detailed quote.',
                'redirect_url' => null,
                'voiceflow_project_id' => null
            ]
        ]);

        // Create the same comprehensive pricing rules
        WidgetPricing::create([
            'widget_id' => $widget->id,
            'category' => 'base_rates',
            'pricing_rules' => [
                'moveSize' => [
                    'studio' => ['basePrice' => 350, 'hours' => 3, 'description' => 'Studio apartment - basic move'],
                    '1-bedroom' => ['basePrice' => 475, 'hours' => 4, 'description' => '1 bedroom apartment/home'],
                    '2-bedroom' => ['basePrice' => 650, 'hours' => 5, 'description' => '2 bedroom apartment/home'],
                    '3-bedroom' => ['basePrice' => 825, 'hours' => 6.5, 'description' => '3 bedroom apartment/home'],
                    '4-bedroom' => ['basePrice' => 1050, 'hours' => 8, 'description' => '4 bedroom apartment/home'],
                    '5-bedroom+' => ['basePrice' => 1300, 'hours' => 10, 'description' => '5+ bedroom apartment/home']
                ],
                'serviceType' => [
                    'full-service' => ['multiplier' => 1.0, 'description' => 'Full service moving with crew and trucks'],
                    'labor-only' => ['multiplier' => 0.65, 'description' => 'Labor only services - customer provides truck']
                ],
                'laborType' => [
                    'loading-unloading' => ['multiplier' => 1.0, 'description' => 'Complete loading and unloading service'],
                    'loading-only' => ['multiplier' => 0.6, 'description' => 'Loading service only'],
                    'unloading-only' => ['multiplier' => 0.6, 'description' => 'Unloading service only']
                ],
                'timeWindow' => [
                    'morning' => ['multiplier' => 1.0, 'description' => 'Standard morning hours'],
                    'afternoon' => ['multiplier' => 1.0, 'description' => 'Standard afternoon hours'],
                    'evening' => ['multiplier' => 1.15, 'description' => 'Evening hours - 15% premium']
                ],
                'distance' => [
                    'costPerMile' => 4.00, 'minimumDistance' => 0,
                    'description' => 'Mileage charge for travel between pickup and destination'
                ]
            ]
        ]);

        WidgetPricing::create([
            'widget_id' => $widget->id,
            'category' => 'challenge_modifiers',
            'pricing_rules' => [
                'challenges' => [
                    'stairs' => ['type' => 'per_flight', 'baseModifier' => 45, 'description' => 'Additional cost per flight of stairs', 'maxFlights' => 10],
                    'elevator' => ['type' => 'discount', 'modifier' => -0.05, 'description' => '5% discount when elevator is available'],
                    'narrow_doorway' => ['type' => 'fixed', 'modifier' => 85, 'description' => 'Fixed fee for narrow doorway complications'],
                    'parking_distance' => ['type' => 'percentage', 'modifier' => 0.15, 'description' => '15% increase for long distance from parking'],
                    'heavy_items' => ['type' => 'percentage', 'modifier' => 0.12, 'description' => '12% increase for heavy/bulky items'],
                    'fragile_items' => ['type' => 'fixed', 'modifier' => 125, 'description' => 'Fixed fee for extra care with fragile items'],
                    'assembly_required' => ['type' => 'fixed', 'modifier' => 150, 'description' => 'Furniture assembly/disassembly service'],
                    'fragile_placement' => ['type' => 'fixed', 'modifier' => 75, 'description' => 'Careful placement of delicate items']
                ],
                'additionalServices' => [
                    'packing' => ['type' => 'percentage', 'modifier' => 0.25, 'description' => '25% increase for packing services'],
                    'insurance' => ['type' => 'percentage', 'modifier' => 0.08, 'description' => '8% increase for additional insurance coverage'],
                    'disassembly' => ['type' => 'fixed', 'modifier' => 200, 'description' => 'Furniture disassembly and reassembly service'],
                    'storage' => ['type' => 'fixed', 'modifier' => 150, 'description' => 'Temporary storage service'],
                    'cleaning' => ['type' => 'fixed', 'modifier' => 175, 'description' => 'Post-move cleaning service']
                ],
                'distance' => [
                    'local' => ['range' => '0-25 miles', 'multiplier' => 1.0, 'description' => 'Local move within 25 miles'],
                    'regional' => ['range' => '26-100 miles', 'multiplier' => 1.35, 'description' => 'Regional move 26-100 miles'],
                    'long_distance' => ['range' => '100+ miles', 'multiplier' => 2.0, 'description' => 'Long distance move over 100 miles']
                ]
            ]
        ]);

        $this->command->info('✅ Created COMPLETE MoovinLeads widget with ALL 17 modules:');
        $this->command->info("   - Company: {$company->name}");
        $this->command->info("   - User: {$user->name} ({$user->email})");
        $this->command->info("   - Widget: {$widget->name}");
        $this->command->info("   - Widget Key: {$widget->widget_key}");
        $this->command->info("   - Total Modules: " . count($widget->enabled_modules) . " (ALL original modules included)");
        $this->command->info("   - Pricing Rules: " . $widget->pricing->count() . " pricing categories");
        $this->command->info("   - API Endpoint: /api/widget/{$widget->widget_key}/config");
        $this->command->info("   - Step Order: " . implode(' → ', [
            'welcome', 'labor-type', 'move-type', 'move-size', 'date-selection', 
            'time-selection', 'pickup-location', 'pickup-challenges', 'destination-location', 
            'destination-challenges', 'route-distance', 'additional-services', 
            'moving-supplies-question', 'moving-supplies-selection', 'contact', 
            'review-details', 'voiceflow-screen'
        ]));
    }
}