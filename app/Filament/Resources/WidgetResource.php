<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WidgetResource\Pages;
use App\Filament\Resources\WidgetResource\RelationManagers;
use App\Models\Widget;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WidgetResource extends Resource
{
    protected static ?string $model = Widget::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Widget Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Kitchen Remodeling Lead Capture'),
                        
                        Forms\Components\TextInput::make('company_name')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('e.g., Premier Kitchen Solutions'),
                        
                        Forms\Components\Select::make('service_category')
                            ->options([
                                'moving-services' => 'Moving Services',
                                'home-services' => 'Home Services',
                                'professional-services' => 'Professional Services',
                                'health-wellness' => 'Health & Wellness',
                                'business-services' => 'Business Services',
                                'local-services' => 'Local Services',
                            ])
                            ->required()
                            ->reactive()
                            ->placeholder('Select your service category'),
                        
                        Forms\Components\TextInput::make('service_subcategory')
                            ->maxLength(255)
                            ->placeholder('e.g., Kitchen Remodeling'),
                        
                        Forms\Components\TextInput::make('domain')
                            ->url()
                            ->placeholder('https://your-website.com')
                            ->helperText('The domain where this widget will be embedded'),
                        
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'published' => 'Published',
                                'paused' => 'Paused',
                            ])
                            ->default('draft')
                            ->required(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Modules Configuration')
                    ->schema([
                        Forms\Components\CheckboxList::make('enabled_modules')
                            ->options([
                                'service-selection' => 'Service Selection (Welcome)',
                                'service-type' => 'Service Type Selection',
                                'location-type' => 'Location Type (Residential/Commercial)',
                                'project-scope' => 'Project Scope/Size',
                                'date-selection' => 'Date Selection (Calendar)',
                                'time-selection' => 'Time Window Selection',
                                'origin-location' => 'Origin/Service Location',
                                'origin-challenges' => 'Origin Location Challenges',
                                'target-location' => 'Target/Delivery Location',
                                'target-challenges' => 'Target Location Challenges',
                                'distance-calculation' => 'Distance/Route Calculation',
                                'additional-services' => 'Additional Services',
                                'supply-inquiry' => 'Supply Inquiry',
                                'supply-selection' => 'Supply Selection & Categories',
                                'contact-info' => 'Contact Information (Required)',
                                'review-quote' => 'Review Details & Quote (Required)',
                                'chat-integration' => 'Chat/AI Integration',
                            ])
                            ->default(['service-selection', 'contact-info', 'review-quote'])
                            ->required()
                            ->reactive()
                            ->helperText('Select the modules you want to include in your widget'),
                    ]),

                Forms\Components\Section::make('Universal Module Configuration')
                    ->description('Configure content for each enabled module. These modules work for any service industry.')
                    ->schema([
                        // Service Selection Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.service-selection.title')
                                    ->label('Welcome Title')
                                    ->default('How can we help you today?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.service-selection.subtitle')
                                    ->label('Welcome Subtitle')
                                    ->placeholder('Optional welcome message'),
                                
                                Forms\Components\Repeater::make('module_configs.service-selection.options')
                                    ->label('Service Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Service Name')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Service Description'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., Truck, Home, Wrench'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Service Option')
                                    ->collapsible(),
                            ])
                            ->visible(fn (callable $get) => in_array('service-selection', $get('enabled_modules') ?? [])),

                        // Service Type Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.service-type.title')
                                    ->label('Service Type Title')
                                    ->default('What type of service do you need?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.service-type.subtitle')
                                    ->label('Service Type Subtitle')
                                    ->placeholder('Help customers choose the right service type'),
                                
                                Forms\Components\Repeater::make('module_configs.service-type.options')
                                    ->label('Service Type Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Type Name')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Type Description'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., ArrowUp, Building'),
                                        Forms\Components\TextInput::make('price_multiplier')
                                            ->label('Price Multiplier')
                                            ->numeric()
                                            ->step(0.01)
                                            ->default(1.0)
                                            ->helperText('Multiplier applied to base price (e.g., 0.6 = 60% of base price)'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Service Type'),
                            ])
                            ->visible(fn (callable $get) => in_array('service-type', $get('enabled_modules') ?? [])),

                        // Location Type Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.location-type.title')
                                    ->label('Location Type Title')
                                    ->default('What type of location?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.location-type.subtitle')
                                    ->label('Location Type Subtitle')
                                    ->placeholder('e.g., Select the type of location for your service'),
                                
                                Forms\Components\Repeater::make('module_configs.location-type.options')
                                    ->label('Location Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Location Type')
                                            ->placeholder('e.g., Residential, Commercial')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Location Description')
                                            ->placeholder('e.g., Home, apartment, condo'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., Home, Building'),
                                        Forms\Components\TextInput::make('price_multiplier')
                                            ->label('Location Price Multiplier')
                                            ->numeric()
                                            ->step(0.01)
                                            ->default(1.0)
                                            ->helperText('Price multiplier for location type (e.g., 1.25 = 25% premium for commercial)'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Location Type'),
                            ])
                            ->visible(fn (callable $get) => in_array('location-type', $get('enabled_modules') ?? [])),

                        // Project Scope Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.project-scope.title')
                                    ->label('Project Scope Title')
                                    ->default('What\'s the scope of your project?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.project-scope.subtitle')
                                    ->label('Project Scope Subtitle')
                                    ->placeholder('Help customers select the right project size'),
                                
                                Forms\Components\Repeater::make('module_configs.project-scope.options')
                                    ->label('Scope Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Scope Name')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Scope Description'),
                                        Forms\Components\TextInput::make('base_price')
                                            ->label('Base Price ($)')
                                            ->numeric()
                                            ->required()
                                            ->helperText('Starting price for this project size'),
                                        Forms\Components\TextInput::make('estimated_hours')
                                            ->label('Estimated Hours')
                                            ->numeric()
                                            ->step(0.5)
                                            ->helperText('Estimated completion time'),
                                        Forms\Components\TextInput::make('price_range_min')
                                            ->label('Price Range Min ($)')
                                            ->numeric()
                                            ->helperText('Minimum price for this scope'),
                                        Forms\Components\TextInput::make('price_range_max')
                                            ->label('Price Range Max ($)')
                                            ->numeric()
                                            ->helperText('Maximum price for complex jobs'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Scope Option'),
                            ])
                            ->visible(fn (callable $get) => in_array('project-scope', $get('enabled_modules') ?? [])),

                        // Date Selection Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.date-selection.title')
                                    ->label('Date Selection Title')
                                    ->default('When do you need service?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.date-selection.subtitle')
                                    ->label('Date Selection Subtitle')
                                    ->placeholder('e.g., Select your preferred service date'),
                            ])
                            ->visible(fn (callable $get) => in_array('date-selection', $get('enabled_modules') ?? [])),

                        // Time Selection Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.time-selection.title')
                                    ->label('Time Window Title')
                                    ->default('What\'s your preferred time?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.time-selection.subtitle')
                                    ->label('Time Window Subtitle')
                                    ->placeholder('Choose the time window that works best'),
                                
                                Forms\Components\Repeater::make('module_configs.time-selection.options')
                                    ->label('Time Window Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Time Window')
                                            ->placeholder('e.g., Morning, Afternoon')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Time Range')
                                            ->placeholder('e.g., 8AM—12PM'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., Sunrise, Sun, Sunset'),
                                        Forms\Components\TextInput::make('price_multiplier')
                                            ->label('Time Premium Multiplier')
                                            ->numeric()
                                            ->step(0.01)
                                            ->default(1.0)
                                            ->helperText('Premium multiplier (e.g., 1.15 = 15% premium for evening)'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Time Window'),
                            ])
                            ->visible(fn (callable $get) => in_array('time-selection', $get('enabled_modules') ?? [])),

                        // Origin Location Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.origin-location.title')
                                    ->label('Origin Location Title')
                                    ->default('What\'s the service location?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.origin-location.subtitle')
                                    ->label('Origin Location Subtitle')
                                    ->placeholder('e.g., Enter the address where service is needed'),
                                
                                Forms\Components\TextInput::make('module_configs.origin-location.address_label')
                                    ->label('Address Field Label')
                                    ->default('Service Address')
                                    ->required(),
                            ])
                            ->visible(fn (callable $get) => in_array('origin-location', $get('enabled_modules') ?? [])),

                        // Distance/Route Calculation Settings
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.distance-calculation.title')
                                    ->label('Distance Calculation Title')
                                    ->default('Route Calculation')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.distance-calculation.subtitle')
                                    ->label('Distance Calculation Subtitle')
                                    ->default('Calculating driving distance for accurate pricing'),
                                
                                Forms\Components\TextInput::make('module_configs.distance-calculation.cost_per_mile')
                                    ->label('Cost Per Mile ($)')
                                    ->numeric()
                                    ->step(0.01)
                                    ->default(4.00)
                                    ->required()
                                    ->helperText('Price charged per mile of travel distance'),
                                
                                Forms\Components\TextInput::make('module_configs.distance-calculation.minimum_distance')
                                    ->label('Minimum Distance (miles)')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Distance below which no mileage charge applies'),
                            ])
                            ->visible(fn (callable $get) => in_array('distance-calculation', $get('enabled_modules') ?? [])),

                        // Origin Challenges Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.origin-challenges.title')
                                    ->label('Location Challenges Title')
                                    ->default('Any challenges at the location?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.origin-challenges.subtitle')
                                    ->label('Challenges Subtitle')
                                    ->placeholder('Help us prepare for any location challenges'),
                                
                                Forms\Components\Repeater::make('module_configs.origin-challenges.options')
                                    ->label('Challenge Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Challenge Name')
                                            ->placeholder('e.g., Stairs, Narrow Access')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Challenge Description'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., AlertTriangle, ArrowUp'),
                                        Forms\Components\Select::make('pricing_type')
                                            ->label('Pricing Type')
                                            ->options([
                                                'fixed' => 'Fixed Amount',
                                                'percentage' => 'Percentage of Total',
                                                'per_unit' => 'Per Unit (e.g., per flight)',
                                                'discount' => 'Discount (negative)'
                                            ])
                                            ->default('fixed')
                                            ->required(),
                                        Forms\Components\TextInput::make('pricing_value')
                                            ->label('Pricing Value')
                                            ->numeric()
                                            ->step(0.01)
                                            ->required()
                                            ->helperText('Fixed: dollar amount, Percentage: 0.15 = 15%, Per Unit: amount per unit'),
                                        Forms\Components\TextInput::make('max_units')
                                            ->label('Maximum Units')
                                            ->numeric()
                                            ->helperText('For per-unit pricing (e.g., max 10 flights of stairs)'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Challenge Option'),
                            ])
                            ->visible(fn (callable $get) => in_array('origin-challenges', $get('enabled_modules') ?? [])),

                        // Additional Services Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.additional-services.title')
                                    ->label('Additional Services Title')
                                    ->default('Any additional services?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.additional-services.subtitle')
                                    ->label('Additional Services Subtitle')
                                    ->placeholder('Select any additional services you might need'),
                                
                                Forms\Components\Repeater::make('module_configs.additional-services.options')
                                    ->label('Additional Service Options')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Service Name')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Service Description'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., Package, Shield, Wrench'),
                                        Forms\Components\Select::make('pricing_type')
                                            ->label('Pricing Type')
                                            ->options([
                                                'fixed' => 'Fixed Amount',
                                                'percentage' => 'Percentage of Total'
                                            ])
                                            ->default('fixed')
                                            ->required(),
                                        Forms\Components\TextInput::make('pricing_value')
                                            ->label('Price/Percentage')
                                            ->numeric()
                                            ->step(0.01)
                                            ->required()
                                            ->helperText('Fixed: dollar amount (e.g., 200), Percentage: decimal (e.g., 0.25 = 25%)'),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Additional Service'),
                            ])
                            ->visible(fn (callable $get) => in_array('additional-services', $get('enabled_modules') ?? [])),

                        // Universal Supply Inquiry Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.supply-inquiry.title')
                                    ->label('Supply Inquiry Title')
                                    ->default('Do you need supplies?')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.supply-inquiry.subtitle')
                                    ->label('Supply Inquiry Subtitle')
                                    ->placeholder('e.g., We offer high-quality supplies for your project'),
                                
                                Forms\Components\TextInput::make('module_configs.supply-inquiry.supply_type')
                                    ->label('Supply Type Name')
                                    ->placeholder('e.g., moving supplies, cleaning supplies, materials')
                                    ->default('supplies')
                                    ->required(),
                            ])
                            ->visible(fn (callable $get) => in_array('supply-inquiry', $get('enabled_modules') ?? [])),

                        // Universal Supply Selection Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.supply-selection.title')
                                    ->label('Supply Selection Title')
                                    ->default('Select Supplies')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.supply-selection.subtitle')
                                    ->label('Supply Selection Subtitle')
                                    ->placeholder('Choose from our selection of supplies'),
                                
                                Forms\Components\Repeater::make('module_configs.supply-selection.categories')
                                    ->label('Supply Categories')
                                    ->schema([
                                        Forms\Components\TextInput::make('name')
                                            ->label('Category Name')
                                            ->placeholder('e.g., Boxes, Tools, Materials')
                                            ->required(),
                                        Forms\Components\TextInput::make('description')
                                            ->label('Category Description')
                                            ->placeholder('Brief description of this supply category'),
                                        Forms\Components\TextInput::make('icon')
                                            ->label('Icon Name')
                                            ->placeholder('e.g., Package, Wrench, Shield'),
                                        Forms\Components\Repeater::make('items')
                                            ->label('Items in Category')
                                            ->schema([
                                                Forms\Components\TextInput::make('name')
                                                    ->label('Item Name')
                                                    ->required(),
                                                Forms\Components\TextInput::make('description')
                                                    ->label('Item Description'),
                                                Forms\Components\TextInput::make('price')
                                                    ->label('Price')
                                                    ->numeric(),
                                            ])
                                            ->defaultItems(1)
                                            ->collapsible(),
                                    ])
                                    ->defaultItems(1)
                                    ->addActionLabel('Add Supply Category')
                                    ->collapsible(),
                            ])
                            ->visible(fn (callable $get) => in_array('supply-selection', $get('enabled_modules') ?? [])),

                        // Contact Info Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.contact-info.title')
                                    ->label('Contact Info Title')
                                    ->default('Let\'s get your contact information')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.contact-info.subtitle')
                                    ->label('Contact Info Subtitle')
                                    ->default('We\'ll use this to send you your quote'),
                            ])
                            ->visible(fn (callable $get) => in_array('contact-info', $get('enabled_modules') ?? [])),

                        // Review Quote Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.review-quote.title')
                                    ->label('Review Quote Title')
                                    ->default('Review Your Project Details')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.review-quote.subtitle')
                                    ->label('Review Quote Subtitle')
                                    ->default('Here\'s your personalized estimate'),
                            ])
                            ->visible(fn (callable $get) => in_array('review-quote', $get('enabled_modules') ?? [])),

                        // Chat Integration Module
                        Forms\Components\Group::make()
                            ->schema([
                                Forms\Components\TextInput::make('module_configs.chat-integration.title')
                                    ->label('Chat Integration Title')
                                    ->default('Chat with Our Expert')
                                    ->required(),
                                
                                Forms\Components\TextInput::make('module_configs.chat-integration.subtitle')
                                    ->label('Chat Integration Subtitle')
                                    ->default('Get instant answers to your questions'),
                                
                                Forms\Components\TextInput::make('module_configs.chat-integration.service_type')
                                    ->label('Service Type Reference')
                                    ->placeholder('e.g., moving, cleaning, construction')
                                    ->helperText('Used in chat context for personalized responses'),
                            ])
                            ->visible(fn (callable $get) => in_array('chat-integration', $get('enabled_modules') ?? [])),
                    ])
                    ->collapsed(false),

                Forms\Components\Section::make('Global Estimation Settings')
                    ->description('Configure global pricing settings that apply to all calculations')
                    ->schema([
                        Forms\Components\TextInput::make('settings.tax_rate')
                            ->label('Tax Rate')
                            ->numeric()
                            ->step(0.01)
                            ->default(0.08)
                            ->helperText('Tax rate as decimal (e.g., 0.08 = 8%)'),
                        
                        Forms\Components\TextInput::make('settings.service_area_miles')
                            ->label('Service Area (miles)')
                            ->numeric()
                            ->default(100)
                            ->helperText('Maximum service area in miles'),
                        
                        Forms\Components\TextInput::make('settings.minimum_job_price')
                            ->label('Minimum Job Price ($)')
                            ->numeric()
                            ->helperText('Minimum price for any job'),
                        
                        Forms\Components\Toggle::make('settings.show_price_ranges')
                            ->label('Show Price Ranges')
                            ->default(true)
                            ->helperText('Show price ranges (e.g., $350-$500) instead of fixed prices'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Branding')
                    ->schema([
                        Forms\Components\ColorPicker::make('branding.primary_color')
                            ->label('Primary Color')
                            ->default('#3b82f6'),
                        
                        Forms\Components\ColorPicker::make('branding.secondary_color')
                            ->label('Secondary Color')
                            ->default('#1f2937'),
                        
                        Forms\Components\FileUpload::make('branding.logo_url')
                            ->label('Logo')
                            ->image()
                            ->maxSize(2048),
                    ])
                    ->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('service_category')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'moving-services' => 'Moving Services',
                        'home-services' => 'Home Services',
                        'professional-services' => 'Professional Services',
                        'health-wellness' => 'Health & Wellness',
                        'business-services' => 'Business Services',
                        'local-services' => 'Local Services',
                        default => $state,
                    }),
                
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
                
                Tables\Columns\TextColumn::make('widget_key')
                    ->label('Widget Key')
                    ->copyable()
                    ->copyMessage('Widget key copied')
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                        'paused' => 'Paused',
                    ]),
                
                Tables\Filters\SelectFilter::make('service_category')
                    ->options([
                        'moving-services' => 'Moving Services',
                        'home-services' => 'Home Services',
                        'professional-services' => 'Professional Services',
                        'health-wellness' => 'Health & Wellness',
                        'business-services' => 'Business Services',
                        'local-services' => 'Local Services',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Widget $record): string => route('api.widget.config', $record->widget_key))
                    ->openUrlInNewTab()
                    ->visible(fn (Widget $record): bool => $record->isPublished()),
                
                Tables\Actions\Action::make('copy_embed')
                    ->icon('heroicon-o-clipboard')
                    ->action(function (Widget $record) {
                        // This would copy embed code to clipboard
                    })
                    ->visible(fn (Widget $record): bool => $record->isPublished()),
                
                Tables\Actions\EditAction::make(),
                
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('company_id', Filament::getTenant()->id);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWidgets::route('/'),
            'create' => Pages\CreateWidget::route('/create'),
            'edit' => Pages\EditWidget::route('/{record}/edit'),
        ];
    }
}
