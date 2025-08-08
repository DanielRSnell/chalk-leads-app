# Chalk Leads Platform - Technical Specification

## Overview
This document provides detailed technical specifications for implementing the universal Chalk Leads service widget builder platform using Laravel, Filament, Inertia.js, React, and ShadCN UI components.

## Database Schema Implementation

### Migration Files

#### 1. Create Widgets Table
```php
<?php
// database/migrations/create_widgets_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('domain')->nullable();
            $table->string('niche', 100);
            $table->enum('status', ['draft', 'published', 'paused'])->default('draft');
            $table->string('widget_key', 32)->unique();
            $table->string('embed_domain')->nullable();
            $table->json('branding')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('widget_key');
        });
    }

    public function down()
    {
        Schema::dropIfExists('widgets');
    }
};
```

#### 2. Create Widget Steps Table
```php
<?php
// database/migrations/create_widget_steps_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('widget_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('step_key', 50);
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->json('prompt')->nullable();
            $table->json('options')->nullable();
            $table->json('buttons')->nullable();
            $table->json('layout')->nullable();
            $table->json('validation')->nullable();
            $table->integer('order_index');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            
            $table->index(['widget_id', 'order_index']);
            $table->unique(['widget_id', 'step_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('widget_steps');
    }
};
```

#### 3. Additional Migrations
```php
<?php
// database/migrations/create_widget_pricing_table.php
return new class extends Migration
{
    public function up()
    {
        Schema::create('widget_pricing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->string('category', 50);
            $table->json('pricing_rules');
            $table->timestamps();
            
            $table->unique(['widget_id', 'category']);
        });
    }
};

// database/migrations/create_widget_leads_table.php
return new class extends Migration
{
    public function up()
    {
        Schema::create('widget_leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('widget_id')->constrained()->onDelete('cascade');
            $table->json('lead_data');
            $table->json('contact_info');
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->enum('status', ['new', 'contacted', 'converted', 'lost'])->default('new');
            $table->string('source_url', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['widget_id', 'status', 'created_at']);
        });
    }
};
```

## Model Implementation

### 1. Widget Model
```php
<?php
// app/Models/Widget.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Widget extends Model
{
    protected $fillable = [
        'name', 'domain', 'niche', 'status', 'embed_domain', 
        'branding', 'settings'
    ];

    protected $casts = [
        'branding' => 'array',
        'settings' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($widget) {
            $widget->widget_key = Str::random(32);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

        return [
            'widget_id' => $this->widget_key,
            'steps_data' => $stepsData,
            'step_order' => $stepOrder,
            'branding' => $this->branding,
            'pricing' => $this->getPricingConfiguration(),
        ];
    }

    private function getPricingConfiguration(): array
    {
        $pricing = [];
        foreach ($this->pricing as $pricingRule) {
            $pricing[$pricingRule->category] = $pricingRule->pricing_rules;
        }
        return $pricing;
    }
}
```

### 2. WidgetStep Model
```php
<?php
// app/Models/WidgetStep.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetStep extends Model
{
    protected $fillable = [
        'step_key', 'title', 'subtitle', 'prompt', 'options', 
        'buttons', 'layout', 'validation', 'order_index', 'is_enabled'
    ];

    protected $casts = [
        'prompt' => 'array',
        'options' => 'array',
        'buttons' => 'array',
        'layout' => 'array',
        'validation' => 'array',
        'is_enabled' => 'boolean',
    ];

    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }
}
```

## API Controllers

### 1. Widget Configuration API
```php
<?php
// app/Http/Controllers/Api/WidgetConfigController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Widget;
use Illuminate\Http\JsonResponse;

class WidgetConfigController extends Controller
{
    public function show(string $widgetKey): JsonResponse
    {
        $widget = Widget::where('widget_key', $widgetKey)
            ->where('status', 'published')
            ->with(['steps', 'pricing'])
            ->first();

        if (!$widget) {
            return response()->json(['error' => 'Widget not found'], 404);
        }

        return response()->json($widget->getConfigurationArray());
    }
}
```

### 2. Lead Submission API
```php
<?php
// app/Http/Controllers/Api/LeadSubmissionController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitLeadRequest;
use App\Models\Widget;
use App\Models\WidgetLead;
use Illuminate\Http\JsonResponse;

class LeadSubmissionController extends Controller
{
    public function store(SubmitLeadRequest $request, string $widgetKey): JsonResponse
    {
        $widget = Widget::where('widget_key', $widgetKey)
            ->where('status', 'published')
            ->first();

        if (!$widget) {
            return response()->json(['error' => 'Widget not found'], 404);
        }

        $lead = WidgetLead::create([
            'widget_id' => $widget->id,
            'lead_data' => $request->input('lead_data'),
            'contact_info' => $request->input('contact_info'),
            'estimated_value' => $request->input('estimated_value'),
            'source_url' => $request->input('source_url'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Send notification email to widget owner
        // Mail::to($widget->user->email)->send(new NewLeadNotification($lead));

        return response()->json([
            'status' => 'success',
            'lead_id' => $lead->id
        ], 201);
    }
}
```

## Filament Resources

### 1. Widget Resource
```php
<?php
// app/Filament/Resources/WidgetResource.php
namespace App\Filament\Resources;

use App\Models\Widget;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WidgetResource extends Resource
{
    protected static ?string $model = Widget::class;
    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Basic Information')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->required()
                        ->maxLength(255),
                    
                    Forms\Components\TextInput::make('domain')
                        ->url()
                        ->maxLength(255),
                    
                    Forms\Components\Select::make('niche')
                        ->options([
                            'moving' => 'Moving Services',
                            'cleaning' => 'Cleaning Services',
                            'landscaping' => 'Landscaping',
                            'home-services' => 'Home Services',
                            'legal' => 'Legal Services',
                            'other' => 'Other',
                        ])
                        ->required(),
                    
                    Forms\Components\Select::make('status')
                        ->options([
                            'draft' => 'Draft',
                            'published' => 'Published',
                            'paused' => 'Paused',
                        ])
                        ->default('draft'),
                ]),

            Forms\Components\Section::make('Branding')
                ->schema([
                    Forms\Components\ColorPicker::make('branding.primary_color')
                        ->label('Primary Color')
                        ->default('#F4C443'),
                    
                    Forms\Components\ColorPicker::make('branding.secondary_color')
                        ->label('Secondary Color')
                        ->default('#1A1A1A'),
                    
                    Forms\Components\TextInput::make('branding.company_name')
                        ->label('Company Name')
                        ->maxLength(255),
                    
                    Forms\Components\FileUpload::make('branding.logo_url')
                        ->label('Logo')
                        ->image(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
                
                Tables\Columns\TextColumn::make('niche')
                    ->badge(),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'published' => 'success',
                        'paused' => 'warning',
                    }),
                
                Tables\Columns\TextColumn::make('leads_count')
                    ->counts('leads')
                    ->label('Leads'),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Widget $record): string => route('widget.preview', $record->widget_key))
                    ->openUrlInNewTab(),
                
                Tables\Actions\Action::make('builder')
                    ->icon('heroicon-o-wrench')
                    ->url(fn (Widget $record): string => route('widgets.builder', $record)),
                
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
```

## React Components for Widget Builder

### 1. Widget Configuration Wizard
```tsx
// resources/js/Pages/Widgets/Configure.tsx
import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { BasicInfoStep } from '@/Components/WidgetConfig/BasicInfoStep';
import { ModuleSelectionStep } from '@/Components/WidgetConfig/ModuleSelectionStep';
import { StepConfigurationStep } from '@/Components/WidgetConfig/StepConfigurationStep';
import { BrandingStep } from '@/Components/WidgetConfig/BrandingStep';
import { PricingStep } from '@/Components/WidgetConfig/PricingStep';
import { ReviewStep } from '@/Components/WidgetConfig/ReviewStep';

interface WidgetData {
    id: number;
    name: string;
    niche: string;
    domain: string;
    enabled_modules: string[];
    steps: StepData[];
    branding: BrandingData;
    pricing: PricingData;
}

const CONFIGURATION_STEPS = [
    { key: 'basic', title: 'Basic Info', component: BasicInfoStep },
    { key: 'modules', title: 'Select Modules', component: ModuleSelectionStep },
    { key: 'steps', title: 'Configure Steps', component: StepConfigurationStep },
    { key: 'branding', title: 'Branding', component: BrandingStep },
    { key: 'pricing', title: 'Pricing', component: PricingStep },
    { key: 'review', title: 'Review & Publish', component: ReviewStep },
];

export default function WidgetConfigure() {
    const { widget } = usePage<{ widget: WidgetData }>().props;
    const [currentStep, setCurrentStep] = useState(0);
    
    const { data, setData, put, processing, errors } = useForm({
        name: widget.name || '',
        niche: widget.niche || '',
        domain: widget.domain || '',
        enabled_modules: widget.enabled_modules || [],
        steps: widget.steps || [],
        branding: widget.branding || {},
        pricing: widget.pricing || {},
    });

    const handleNext = () => {
        if (currentStep < CONFIGURATION_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSave = () => {
        put(route('widgets.update', widget.id));
    };

    const CurrentStepComponent = CONFIGURATION_STEPS[currentStep].component;

    return (
        <>
            <Head title={`Configure ${widget.name}`} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {CONFIGURATION_STEPS.map((step, index) => (
                                <div key={step.key} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        index <= currentStep
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className={`ml-2 text-sm ${
                                        index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {step.title}
                                    </span>
                                    {index < CONFIGURATION_STEPS.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-4 ${
                                            index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {CONFIGURATION_STEPS[currentStep].title}
                            </h2>
                        </div>

                        <CurrentStepComponent
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        {/* Navigation */}
                        <div className="flex justify-between pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="space-x-3">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={processing}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Save Draft
                                </button>

                                {currentStep === CONFIGURATION_STEPS.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={processing}
                                        className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Publish Widget
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
```

### 2. Module Selection Step Component
```tsx
// resources/js/Components/WidgetConfig/ModuleSelectionStep.tsx
import React from 'react';

const AVAILABLE_MODULES = [
    { key: 'welcome', title: 'Welcome Screen', description: 'Initial greeting and service selection' },
    { key: 'labor-type', title: 'Labor Type', description: 'Loading/unloading options (for labor-only services)' },
    { key: 'move-type', title: 'Move Type', description: 'Residential, storage, or commercial' },
    { key: 'move-size', title: 'Move Size', description: 'Studio to 5+ bedroom selection' },
    { key: 'date-selection', title: 'Date Selection', description: 'Interactive calendar date picker' },
    { key: 'time-selection', title: 'Time Selection', description: 'Morning or afternoon time windows' },
    { key: 'pickup-location', title: 'Pickup Location', description: 'Address collection with autocomplete' },
    { key: 'pickup-challenges', title: 'Pickup Challenges', description: 'Access difficulties (stairs, elevator, etc.)' },
    { key: 'destination-location', title: 'Destination Location', description: 'Delivery address validation' },
    { key: 'destination-challenges', title: 'Destination Challenges', description: 'Delivery access assessment' },
    { key: 'route-distance', title: 'Route Calculation', description: 'Automatic mileage and distance calculation' },
    { key: 'additional-services', title: 'Additional Services', description: 'Packing, insurance, supplies' },
    { key: 'moving-supplies-question', title: 'Moving Supplies Question', description: 'Who provides supplies?' },
    { key: 'moving-supplies-selection', title: 'Moving Supplies Selection', description: 'Specific supply needs' },
    { key: 'contact-info', title: 'Contact Information', description: 'Name, email, phone validation' },
    { key: 'review-details', title: 'Review Details', description: 'Complete quote with pricing' },
    { key: 'voiceflow-screen', title: 'AI Chat Integration', description: 'Voiceflow chat for additional questions' },
];

interface ModuleSelectionStepProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
}

export function ModuleSelectionStep({ data, setData, errors }: ModuleSelectionStepProps) {
    const handleModuleToggle = (moduleKey: string, enabled: boolean) => {
        const currentModules = data.enabled_modules || [];
        let updatedModules;

        if (enabled) {
            updatedModules = [...currentModules, moduleKey];
        } else {
            updatedModules = currentModules.filter((key: string) => key !== moduleKey);
        }

        setData('enabled_modules', updatedModules);
    };

    const isModuleEnabled = (moduleKey: string) => {
        return (data.enabled_modules || []).includes(moduleKey);
    };

    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600">
                Select which modules you want to include in your widget. You can always add or remove modules later.
            </div>

            <div className="grid grid-cols-1 gap-4">
                {AVAILABLE_MODULES.map((module) => (
                    <div key={module.key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`module-${module.key}`}
                                        checked={isModuleEnabled(module.key)}
                                        onChange={(e) => handleModuleToggle(module.key, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={`module-${module.key}`}
                                        className="ml-3 font-medium text-gray-900"
                                    >
                                        {module.title}
                                    </label>
                                </div>
                                <p className="ml-7 mt-1 text-sm text-gray-500">
                                    {module.description}
                                </p>
                            </div>
                            
                            {/* Required modules */}
                            {['welcome', 'contact-info', 'review-details'].includes(module.key) && (
                                <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Required
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {errors.enabled_modules && (
                <div className="text-red-600 text-sm">
                    {errors.enabled_modules}
                </div>
            )}
        </div>
    );
}
```

## Route Configuration

```php
<?php
// routes/api.php
use App\Http\Controllers\Api\WidgetConfigController;
use App\Http\Controllers\Api\LeadSubmissionController;
use App\Http\Controllers\Api\UserWidgetController;

// Public widget API
Route::prefix('widget')->group(function () {
    Route::get('{widgetKey}/config', [WidgetConfigController::class, 'show']);
    Route::post('{widgetKey}/leads', [LeadSubmissionController::class, 'store']);
});

// Protected user API
Route::middleware(['auth:sanctum'])->prefix('user')->group(function () {
    Route::apiResource('widgets', UserWidgetController::class);
    Route::put('widgets/{widget}/steps/reorder', [UserWidgetController::class, 'reorderSteps']);
    Route::get('widgets/{widget}/leads', [UserWidgetController::class, 'leads']);
});

// routes/web.php
use App\Http\Controllers\WidgetBuilderController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/widgets/{widget}/builder', [WidgetBuilderController::class, 'builder'])
        ->name('widgets.builder');
});
```

This technical specification provides the foundation for implementing the widget builder platform with the exact same JSON structure as your existing widget system.