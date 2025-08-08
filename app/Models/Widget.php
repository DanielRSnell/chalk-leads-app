<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Widget extends Model
{
    protected $fillable = [
        'company_id',
        'name',
        'service_category',
        'service_subcategory',
        'domain',
        'company_name',
        'status',
        'embed_domain',
        'enabled_modules',
        'module_configs',
        'branding',
        'settings',
    ];

    protected $casts = [
        'enabled_modules' => 'array',
        'module_configs' => 'array',
        'branding' => 'array',
        'settings' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($widget) {
            if (empty($widget->widget_key)) {
                $widget->widget_key = Str::random(32);
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(WidgetStep::class)->orderBy('order_index');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(WidgetLead::class);
    }

    public function pricing(): HasMany
    {
        return $this->hasMany(WidgetPricing::class);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function getConfigurationArray(): array
    {
        $stepsData = [];
        $stepOrder = [];

        // If we have steps in the database, use those
        if ($this->steps->count() > 0) {
            foreach ($this->steps as $step) {
                $stepsData[$step->step_key] = [
                    'id' => $step->step_key,
                    'title' => $step->title,
                    'subtitle' => $step->subtitle,
                    'prompt' => $step->prompt,
                    'options' => $step->options,
                    'buttons' => $step->buttons,
                    'layout' => $step->layout,
                    'validation' => $step->validation,
                ];
                $stepOrder[] = $step->step_key;
            }
        } 
        // Otherwise, generate steps from module_configs
        else if ($this->enabled_modules && $this->module_configs) {
            foreach ($this->enabled_modules as $moduleKey) {
                if (isset($this->module_configs[$moduleKey])) {
                    $moduleConfig = $this->module_configs[$moduleKey];
                    
                    $stepsData[$moduleKey] = [
                        'id' => $moduleKey,
                        'title' => $moduleConfig['title'] ?? ucwords(str_replace('-', ' ', $moduleKey)),
                        'subtitle' => $moduleConfig['subtitle'] ?? null,
                        'prompt' => [
                            'message' => $moduleConfig['title'] ?? ucwords(str_replace('-', ' ', $moduleKey)),
                            'type' => $this->getPromptType($moduleKey)
                        ],
                        'options' => $this->formatModuleOptions($moduleKey, $moduleConfig),
                        'buttons' => $this->getModuleButtons($moduleKey),
                        'layout' => $this->getModuleLayout($moduleKey),
                        'validation' => [
                            'required' => $this->isModuleRequired($moduleKey),
                            'field' => $moduleKey
                        ]
                    ];
                    $stepOrder[] = $moduleKey;
                }
            }
        }

        return [
            'widget_id' => $this->widget_key,
            'steps_data' => $stepsData,
            'step_order' => $stepOrder,
            'branding' => $this->branding,
            'pricing' => $this->getPricingConfiguration(),
            'estimation_settings' => [
                'tax_rate' => floatval($this->settings['tax_rate'] ?? 0.08),
                'service_area_miles' => intval($this->settings['service_area_miles'] ?? 100),
                'minimum_job_price' => floatval($this->settings['minimum_job_price'] ?? 0),
                'show_price_ranges' => boolval($this->settings['show_price_ranges'] ?? true),
                'currency' => 'USD',
                'currency_symbol' => '$'
            ]
        ];
    }

    private function formatModuleOptions(string $moduleKey, array $moduleConfig): array
    {
        $options = [];
        
        if (isset($moduleConfig['options']) && is_array($moduleConfig['options'])) {
            foreach ($moduleConfig['options'] as $index => $option) {
                $formattedOption = [
                    'id' => $moduleKey . '_option_' . $index,
                    'value' => $option['title'] ?? '',
                    'title' => $option['title'] ?? '',
                    'description' => $option['description'] ?? '',
                    'icon' => $option['icon'] ?? null,
                    'type' => 'service'
                ];

                // Add estimation fields based on module type
                if ($moduleKey === 'project-scope') {
                    $formattedOption['estimation'] = [
                        'base_price' => floatval($option['base_price'] ?? 0),
                        'estimated_hours' => floatval($option['estimated_hours'] ?? 0),
                        'price_range_min' => floatval($option['price_range_min'] ?? 0),
                        'price_range_max' => floatval($option['price_range_max'] ?? 0)
                    ];
                }

                if ($moduleKey === 'service-type' && isset($option['price_multiplier'])) {
                    $formattedOption['estimation'] = [
                        'price_multiplier' => floatval($option['price_multiplier'])
                    ];
                }

                if ($moduleKey === 'location-type' && isset($option['price_multiplier'])) {
                    $formattedOption['estimation'] = [
                        'price_multiplier' => floatval($option['price_multiplier'])
                    ];
                }

                if ($moduleKey === 'time-selection' && isset($option['price_multiplier'])) {
                    $formattedOption['estimation'] = [
                        'price_multiplier' => floatval($option['price_multiplier'])
                    ];
                }

                if (in_array($moduleKey, ['origin-challenges', 'target-challenges'])) {
                    $formattedOption['estimation'] = [
                        'pricing_type' => $option['pricing_type'] ?? 'fixed',
                        'pricing_value' => floatval($option['pricing_value'] ?? 0),
                        'max_units' => intval($option['max_units'] ?? 1)
                    ];
                }

                if ($moduleKey === 'additional-services') {
                    $formattedOption['estimation'] = [
                        'pricing_type' => $option['pricing_type'] ?? 'fixed',
                        'pricing_value' => floatval($option['pricing_value'] ?? 0)
                    ];
                }

                $options[] = $formattedOption;
            }
        }

        // Add distance calculation settings if this is distance-calculation module
        if ($moduleKey === 'distance-calculation') {
            $options[] = [
                'id' => 'distance_settings',
                'type' => 'distance_calculation',
                'estimation' => [
                    'cost_per_mile' => floatval($moduleConfig['cost_per_mile'] ?? 4.00),
                    'minimum_distance' => floatval($moduleConfig['minimum_distance'] ?? 0)
                ]
            ];
        }

        return $options;
    }

    private function getPricingConfiguration(): array
    {
        $pricing = [];
        foreach ($this->pricing as $pricingRule) {
            $pricing[$pricingRule->category] = $pricingRule->pricing_rules;
        }
        return $pricing;
    }

    private function getPromptType(string $moduleKey): string
    {
        $typeMap = [
            'service-selection' => 'avatar',
            'date-selection' => 'calendar',
            'origin-location' => 'address',
            'target-location' => 'address',
            'distance-calculation' => 'calculation',
            'chat-integration' => 'chat'
        ];
        
        return $typeMap[$moduleKey] ?? 'text';
    }

    private function getModuleButtons(string $moduleKey): array
    {
        $buttonMap = [
            'supply-inquiry' => [
                'primary' => ['text' => 'Continue', 'action' => 'auto']
            ],
            'contact-info' => [
                'primary' => ['text' => 'Get Quote', 'action' => 'submit']
            ],
            'review-quote' => [
                'primary' => ['text' => 'Confirm', 'action' => 'submit'],
                'secondary' => ['text' => 'Back', 'action' => 'back']
            ]
        ];

        return $buttonMap[$moduleKey] ?? [
            'primary' => ['text' => 'Continue', 'action' => 'next']
        ];
    }

    private function getModuleLayout(string $moduleKey): array
    {
        $layoutMap = [
            'date-selection' => ['type' => 'calendar', 'centered' => true],
            'origin-location' => ['type' => 'form', 'centered' => false],
            'target-location' => ['type' => 'form', 'centered' => false],
            'origin-challenges' => ['type' => 'challenges', 'centered' => false],
            'target-challenges' => ['type' => 'challenges', 'centered' => false],
            'distance-calculation' => ['type' => 'route-calculation', 'centered' => true],
            'supply-selection' => ['type' => 'catalog', 'columns' => 2],
            'additional-services' => ['type' => 'list', 'selectable' => 'multiple']
        ];

        return $layoutMap[$moduleKey] ?? [
            'type' => 'grid', 'columns' => 1, 'centered' => true
        ];
    }

    private function isModuleRequired(string $moduleKey): bool
    {
        $requiredModules = [
            'service-selection',
            'contact-info',
            'review-quote'
        ];

        return in_array($moduleKey, $requiredModules);
    }
}
