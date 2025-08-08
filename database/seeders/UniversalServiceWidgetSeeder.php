<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use App\Models\Widget;
use App\Models\WidgetPricing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UniversalServiceWidgetSeeder extends Seeder
{
    public function run(): void
    {
        $this->createMovingServiceWidget();
        $this->createCleaningServiceWidget();
        $this->createLandscapingServiceWidget();
    }

    private function createMovingServiceWidget(): void
    {
        $company = Company::create([
            'name' => 'Premier Moving Services',
            'domain' => 'premiermovingservices.com',
            'settings' => [
                'timezone' => 'America/New_York',
                'phone' => '(555) 123-MOVE',
                'email' => 'info@premiermovingservices.com',
                'address' => '123 Moving Boulevard, Chicago, IL 60601'
            ]
        ]);

        $user = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@premiermovingservices.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        Widget::create([
            'company_id' => $company->id,
            'name' => 'Moving Services Widget',
            'service_category' => 'moving-services',
            'service_subcategory' => 'Full Service & Labor Only Moving',
            'domain' => 'premiermovingservices.com',
            'company_name' => 'Premier Moving Services',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',
                'service-type', 
                'project-scope',
                'date-selection',
                'time-selection',
                'origin-location',
                'target-location',
                'additional-services',
                'supply-inquiry',
                'supply-selection',
                'contact-info',
                'review-quote'
            ],
            'module_configs' => [
                'service-selection' => [
                    'title' => 'How can we help with your move?',
                    'subtitle' => 'Choose the moving service that fits your needs',
                    'options' => [
                        [
                            'title' => 'Full Service Moving',
                            'description' => 'We handle everything - packing, loading, moving, and unpacking',
                            'icon' => 'Truck'
                        ],
                        [
                            'title' => 'Labor Only',
                            'description' => 'You provide the truck, we provide the muscle',
                            'icon' => 'Users'
                        ]
                    ]
                ],
                'service-type' => [
                    'title' => 'What type of labor help do you need?',
                    'subtitle' => 'Select the specific service type',
                    'options' => [
                        [
                            'title' => 'Loading & Unloading',
                            'description' => 'Complete loading and unloading service',
                            'icon' => 'ArrowUpDown'
                        ],
                        [
                            'title' => 'Loading Only',
                            'description' => 'Just help loading your truck',
                            'icon' => 'ArrowUp'
                        ]
                    ]
                ],
                'project-scope' => [
                    'title' => 'What size is your move?',
                    'subtitle' => 'Select the size that best describes your move',
                    'options' => [
                        ['title' => 'Studio/1BR', 'description' => 'Starting at $350', 'price_modifier' => 350],
                        ['title' => '2 Bedroom', 'description' => 'Starting at $650', 'price_modifier' => 650],
                        ['title' => '3+ Bedroom', 'description' => 'Starting at $825', 'price_modifier' => 825]
                    ]
                ],
                'origin-location' => [
                    'title' => 'Where are you moving from?',
                    'subtitle' => 'Enter your current address for accurate pricing',
                    'address_label' => 'Pickup Address'
                ],
                'target-location' => [
                    'title' => 'Where are you moving to?',
                    'subtitle' => 'Enter your destination address',
                    'address_label' => 'Delivery Address'
                ],
                'supply-inquiry' => [
                    'title' => 'Do you need moving supplies?',
                    'subtitle' => 'We offer high-quality packing supplies delivered to your door',
                    'supply_type' => 'moving supplies'
                ],
                'supply-selection' => [
                    'title' => 'Select Moving Supplies',
                    'subtitle' => 'Choose from our professional moving supplies',
                    'categories' => [
                        [
                            'name' => 'Moving Boxes',
                            'description' => 'Various sizes of professional moving boxes',
                            'icon' => 'Package',
                            'items' => [
                                ['name' => 'Small Box', 'description' => '16x12x12 - Books, CDs', 'price' => 3.50],
                                ['name' => 'Medium Box', 'description' => '18x14x12 - Clothes, dishes', 'price' => 4.25],
                                ['name' => 'Large Box', 'description' => '24x18x18 - Pillows, linens', 'price' => 5.75]
                            ]
                        ],
                        [
                            'name' => 'Packing Materials',
                            'description' => 'Professional packing and protection materials',
                            'icon' => 'Shield',
                            'items' => [
                                ['name' => 'Bubble Wrap', 'description' => '12" x 100ft roll', 'price' => 25.99],
                                ['name' => 'Packing Paper', 'description' => 'Clean newsprint - 25lb pack', 'price' => 19.99],
                                ['name' => 'Packing Tape', 'description' => 'Heavy duty - 6 pack', 'price' => 15.99]
                            ]
                        ]
                    ]
                ],
                'contact-info' => [
                    'title' => 'Let\'s get your contact information',
                    'subtitle' => 'We\'ll send you a detailed quote within an hour'
                ],
                'review-quote' => [
                    'title' => 'Review Your Moving Quote',
                    'subtitle' => 'Here\'s your personalized moving estimate'
                ]
            ],
            'branding' => [
                'primary_color' => '#1E40AF',
                'secondary_color' => '#1F2937'
            ]
        ]);
    }

    private function createCleaningServiceWidget(): void
    {
        $company = Company::create([
            'name' => 'Sparkle Clean Pro',
            'domain' => 'sparkcleanpro.com',
            'settings' => [
                'timezone' => 'America/Los_Angeles',
                'phone' => '(555) 456-CLEAN',
                'email' => 'info@sparkcleanpro.com'
            ]
        ]);

        $user = User::create([
            'name' => 'Maria Rodriguez',
            'email' => 'maria@sparkcleanpro.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        Widget::create([
            'company_id' => $company->id,
            'name' => 'Cleaning Services Widget',
            'service_category' => 'home-services',
            'service_subcategory' => 'Professional Cleaning',
            'domain' => 'sparkcleanpro.com',
            'company_name' => 'Sparkle Clean Pro',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',
                'location-type',
                'project-scope',
                'date-selection',
                'time-selection',
                'origin-location',
                'additional-services',
                'supply-inquiry',
                'contact-info',
                'review-quote'
            ],
            'module_configs' => [
                'service-selection' => [
                    'title' => 'What cleaning service do you need?',
                    'subtitle' => 'Professional cleaning services tailored to your needs',
                    'options' => [
                        [
                            'title' => 'Regular House Cleaning',
                            'description' => 'Weekly, bi-weekly, or monthly cleaning service',
                            'icon' => 'Home'
                        ],
                        [
                            'title' => 'Deep Cleaning',
                            'description' => 'Intensive one-time or seasonal deep clean',
                            'icon' => 'Wrench'
                        ],
                        [
                            'title' => 'Move-in/Move-out',
                            'description' => 'Complete cleaning for moving transitions',
                            'icon' => 'Package'
                        ]
                    ]
                ],
                'location-type' => [
                    'title' => 'What type of property?',
                    'subtitle' => 'Select your property type for accurate pricing',
                    'options' => [
                        [
                            'title' => 'House',
                            'description' => 'Single-family home or townhouse',
                            'icon' => 'Home'
                        ],
                        [
                            'title' => 'Apartment/Condo',
                            'description' => 'Apartment or condominium unit',
                            'icon' => 'Building'
                        ],
                        [
                            'title' => 'Office',
                            'description' => 'Commercial office space',
                            'icon' => 'Building'
                        ]
                    ]
                ],
                'project-scope' => [
                    'title' => 'How many bedrooms and bathrooms?',
                    'subtitle' => 'Select your home size for accurate pricing',
                    'options' => [
                        ['title' => '1 Bed, 1 Bath', 'description' => 'Starting at $89', 'price_modifier' => 89],
                        ['title' => '2 Bed, 2 Bath', 'description' => 'Starting at $129', 'price_modifier' => 129],
                        ['title' => '3 Bed, 2 Bath', 'description' => 'Starting at $159', 'price_modifier' => 159],
                        ['title' => '4+ Bed, 3+ Bath', 'description' => 'Starting at $199', 'price_modifier' => 199]
                    ]
                ],
                'origin-location' => [
                    'title' => 'Where do you need cleaning?',
                    'subtitle' => 'Enter your address for scheduling and routing',
                    'address_label' => 'Service Address'
                ],
                'additional-services' => [
                    'title' => 'Any additional services?',
                    'subtitle' => 'Add extra services to make your home sparkle',
                    'options' => [
                        [
                            'title' => 'Inside Oven Cleaning',
                            'description' => 'Deep clean inside your oven (+$25)',
                            'icon' => 'Wrench'
                        ],
                        [
                            'title' => 'Inside Fridge Cleaning',
                            'description' => 'Clean inside refrigerator (+$20)',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'Window Cleaning',
                            'description' => 'Interior window cleaning (+$35)',
                            'icon' => 'Home'
                        ]
                    ]
                ],
                'supply-inquiry' => [
                    'title' => 'Do you need cleaning supplies?',
                    'subtitle' => 'We can provide eco-friendly cleaning products',
                    'supply_type' => 'cleaning supplies'
                ],
                'contact-info' => [
                    'title' => 'Let\'s schedule your cleaning',
                    'subtitle' => 'We\'ll confirm your appointment within 2 hours'
                ],
                'review-quote' => [
                    'title' => 'Review Your Cleaning Service',
                    'subtitle' => 'Here\'s your personalized cleaning quote'
                ]
            ],
            'branding' => [
                'primary_color' => '#10B981',
                'secondary_color' => '#1F2937'
            ]
        ]);
    }

    private function createLandscapingServiceWidget(): void
    {
        $company = Company::create([
            'name' => 'GreenThumb Landscaping',
            'domain' => 'greenthumblandscaping.com',
            'settings' => [
                'timezone' => 'America/Denver',
                'phone' => '(555) 789-GREEN',
                'email' => 'info@greenthumblandscaping.com'
            ]
        ]);

        $user = User::create([
            'name' => 'David Chen',
            'email' => 'david@greenthumblandscaping.com',
            'password' => Hash::make('password'),
            'company_id' => $company->id,
            'role' => 'admin',
            'is_active' => true,
        ]);

        Widget::create([
            'company_id' => $company->id,
            'name' => 'Landscaping Services Widget',
            'service_category' => 'home-services',
            'service_subcategory' => 'Landscaping & Lawn Care',
            'domain' => 'greenthumblandscaping.com',
            'company_name' => 'GreenThumb Landscaping',
            'status' => 'published',
            'enabled_modules' => [
                'service-selection',
                'project-scope',
                'date-selection',
                'origin-location',
                'additional-services',
                'supply-selection',
                'contact-info',
                'review-quote'
            ],
            'module_configs' => [
                'service-selection' => [
                    'title' => 'What landscaping service do you need?',
                    'subtitle' => 'Transform your outdoor space with professional landscaping',
                    'options' => [
                        [
                            'title' => 'Lawn Maintenance',
                            'description' => 'Regular mowing, edging, and lawn care',
                            'icon' => 'Home'
                        ],
                        [
                            'title' => 'Garden Design',
                            'description' => 'Custom garden design and installation',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'Tree & Shrub Care',
                            'description' => 'Pruning, trimming, and plant health',
                            'icon' => 'Wrench'
                        ]
                    ]
                ],
                'project-scope' => [
                    'title' => 'What\'s the size of your property?',
                    'subtitle' => 'Select your property size for accurate pricing',
                    'options' => [
                        ['title' => 'Small Yard (< 1/4 acre)', 'description' => 'Starting at $75', 'price_modifier' => 75],
                        ['title' => 'Medium Yard (1/4 - 1/2 acre)', 'description' => 'Starting at $125', 'price_modifier' => 125],
                        ['title' => 'Large Yard (1/2 - 1 acre)', 'description' => 'Starting at $200', 'price_modifier' => 200],
                        ['title' => 'Extra Large (1+ acres)', 'description' => 'Starting at $300', 'price_modifier' => 300]
                    ]
                ],
                'origin-location' => [
                    'title' => 'Where is your property located?',
                    'subtitle' => 'Enter your address for scheduling and estimates',
                    'address_label' => 'Property Address'
                ],
                'additional-services' => [
                    'title' => 'Any additional services?',
                    'subtitle' => 'Complete your landscaping project with these services',
                    'options' => [
                        [
                            'title' => 'Mulching',
                            'description' => 'Fresh mulch application for gardens (+$150)',
                            'icon' => 'Package'
                        ],
                        [
                            'title' => 'Irrigation System Check',
                            'description' => 'Inspect and adjust sprinkler systems (+$75)',
                            'icon' => 'Wrench'
                        ],
                        [
                            'title' => 'Seasonal Cleanup',
                            'description' => 'Leaf removal and seasonal preparation (+$125)',
                            'icon' => 'Home'
                        ]
                    ]
                ],
                'supply-selection' => [
                    'title' => 'Select Plants & Materials',
                    'subtitle' => 'Choose from our selection of plants and landscaping materials',
                    'categories' => [
                        [
                            'name' => 'Plants & Flowers',
                            'description' => 'Seasonal plants and perennial flowers',
                            'icon' => 'Package',
                            'items' => [
                                ['name' => 'Annual Flowers', 'description' => 'Seasonal colorful flowers', 'price' => 12.99],
                                ['name' => 'Perennial Plants', 'description' => 'Long-lasting garden plants', 'price' => 24.99],
                                ['name' => 'Shrubs', 'description' => 'Foundation and accent shrubs', 'price' => 45.99]
                            ]
                        ],
                        [
                            'name' => 'Mulch & Soil',
                            'description' => 'Premium soil amendments and mulch',
                            'icon' => 'Archive',
                            'items' => [
                                ['name' => 'Hardwood Mulch', 'description' => 'Premium hardwood mulch - per yard', 'price' => 35.00],
                                ['name' => 'Topsoil', 'description' => 'Premium topsoil - per yard', 'price' => 28.00],
                                ['name' => 'Compost', 'description' => 'Organic compost - per yard', 'price' => 32.00]
                            ]
                        ]
                    ]
                ],
                'contact-info' => [
                    'title' => 'Let\'s discuss your landscaping project',
                    'subtitle' => 'We\'ll provide a detailed estimate within 24 hours'
                ],
                'review-quote' => [
                    'title' => 'Review Your Landscaping Project',
                    'subtitle' => 'Here\'s your personalized landscaping estimate'
                ]
            ],
            'branding' => [
                'primary_color' => '#16A34A',
                'secondary_color' => '#1F2937'
            ]
        ]);
    }
}