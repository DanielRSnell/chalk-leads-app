import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    Check, 
    Truck, 
    Home, 
    Briefcase, 
    Heart, 
    Building2, 
    MapPin,
    Settings,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Save
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Create Widget', href: '/widgets/create' },
];

interface CreateWidgetForm {
    name: string;
    service_category: string;
    service_subcategory: string;
    company_name: string;
    domain: string;
    enabled_modules: string[];
    module_configs: Record<string, any>;
    branding: {
        primary_color: string;
        secondary_color: string;
    };
    settings: {
        tax_rate: number;
        service_area_miles: number;
        minimum_job_price: number;
        show_price_ranges: boolean;
    };
}

const serviceCategories = [
    { 
        id: 'moving-services', 
        name: 'Moving Services', 
        icon: Truck, 
        color: 'bg-blue-500',
        description: 'Local, long-distance, and specialty moving'
    },
    { 
        id: 'home-services', 
        name: 'Home Services', 
        icon: Home, 
        color: 'bg-green-500',
        description: 'Cleaning, handyman, and maintenance'
    },
    { 
        id: 'professional-services', 
        name: 'Professional Services', 
        icon: Briefcase, 
        color: 'bg-purple-500',
        description: 'Consulting, legal, and business services'
    },
    { 
        id: 'health-wellness', 
        name: 'Health & Wellness', 
        icon: Heart, 
        color: 'bg-pink-500',
        description: 'Fitness, therapy, and medical services'
    },
    { 
        id: 'business-services', 
        name: 'Business Services', 
        icon: Building2, 
        color: 'bg-orange-500',
        description: 'Marketing, accounting, and operations'
    },
    { 
        id: 'local-services', 
        name: 'Local Services', 
        icon: MapPin, 
        color: 'bg-teal-500',
        description: 'Food delivery, transportation, and local'
    },
];

const moduleDefinitions = [
    { 
        id: 'service-selection', 
        name: 'Service Selection', 
        description: 'Welcome screen with service options', 
        required: true,
        configurable: true,
        fields: ['title', 'subtitle', 'options']
    },
    { 
        id: 'service-type', 
        name: 'Service Type', 
        description: 'Detailed service type selection',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_multipliers']
    },
    { 
        id: 'location-type', 
        name: 'Location Type', 
        description: 'Residential, commercial, or storage',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_multipliers']
    },
    { 
        id: 'project-scope', 
        name: 'Project Scope', 
        description: 'Size and complexity selection',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_pricing']
    },
    { 
        id: 'date-selection', 
        name: 'Date Selection', 
        description: 'Calendar date picker',
        configurable: true,
        fields: ['title', 'subtitle']
    },
    { 
        id: 'time-selection', 
        name: 'Time Selection', 
        description: 'Time window preferences',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_multipliers']
    },
    { 
        id: 'origin-location', 
        name: 'Pickup Location', 
        description: 'Starting address input',
        configurable: true,
        fields: ['title', 'subtitle', 'address_label']
    },
    { 
        id: 'origin-challenges', 
        name: 'Pickup Challenges', 
        description: 'Stairs, elevators, etc.',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_pricing_types']
    },
    { 
        id: 'target-location', 
        name: 'Destination', 
        description: 'Delivery address input',
        configurable: true,
        fields: ['title', 'subtitle', 'address_label']
    },
    { 
        id: 'target-challenges', 
        name: 'Destination Challenges', 
        description: 'Access difficulties',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_pricing_types']
    },
    { 
        id: 'distance-calculation', 
        name: 'Distance Calculation', 
        description: 'Route and mileage pricing',
        configurable: true,
        fields: ['title', 'subtitle', 'cost_per_mile', 'minimum_distance']
    },
    { 
        id: 'additional-services', 
        name: 'Additional Services', 
        description: 'Add-on services and pricing',
        configurable: true,
        fields: ['title', 'subtitle', 'options_with_pricing_types']
    },
    { 
        id: 'supply-selection', 
        name: 'Supply Selection', 
        description: 'Materials and supplies catalog',
        configurable: true,
        fields: ['title', 'subtitle', 'categories']
    },
    { 
        id: 'contact-info', 
        name: 'Contact Information', 
        description: 'Lead capture form', 
        required: true,
        configurable: true,
        fields: ['title', 'subtitle']
    },
    { 
        id: 'review-quote', 
        name: 'Review & Quote', 
        description: 'Final estimate and submission', 
        required: true,
        configurable: true,
        fields: ['title', 'subtitle']
    },
];

const steps = [
    { id: 1, title: 'Basic Details', subtitle: 'Widget information and service category' },
    { id: 2, title: 'Module Selection', subtitle: 'Choose your customer journey modules' },
    { id: 3, title: 'Module Configuration', subtitle: 'Configure each enabled module' },
    { id: 4, title: 'Branding & Settings', subtitle: 'Customize appearance and global settings' },
    { id: 5, title: 'Review & Create', subtitle: 'Review and create your widget' },
];

export default function CreateAdvancedWidget() {
    const [currentStep, setCurrentStep] = useState(1);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    
    const { data, setData, post, processing, errors } = useForm<CreateWidgetForm>({
        name: '',
        service_category: '',
        service_subcategory: '',
        company_name: '',
        domain: '',
        enabled_modules: ['service-selection', 'contact-info', 'review-quote'],
        module_configs: {},
        branding: {
            primary_color: '#8B5CF6',
            secondary_color: '#EC4899',
        },
        settings: {
            tax_rate: 0.08,
            service_area_miles: 100,
            minimum_job_price: 0,
            show_price_ranges: true,
        },
    });

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleModule = (moduleId: string) => {
        const module = moduleDefinitions.find(m => m.id === moduleId);
        if (module?.required) return; // Can't toggle required modules
        
        const currentModules = data.enabled_modules;
        const newModules = currentModules.includes(moduleId)
            ? currentModules.filter(id => id !== moduleId)
            : [...currentModules, moduleId];
        
        setData('enabled_modules', newModules);
        
        // Remove module config if disabled
        if (!newModules.includes(moduleId)) {
            const newConfigs = { ...data.module_configs };
            delete newConfigs[moduleId];
            setData('module_configs', newConfigs);
        } else {
            // Initialize module config if enabled
            initializeModuleConfig(moduleId);
        }
    };

    const initializeModuleConfig = (moduleId: string) => {
        const module = moduleDefinitions.find(m => m.id === moduleId);
        if (!module) return;

        const defaultConfig: any = {
            title: `${module.name} Title`,
            subtitle: `${module.description}`,
        };

        // Add default configurations based on module type
        if (module.fields.includes('options')) {
            defaultConfig.options = [
                { title: 'Option 1', description: 'Description for option 1', icon: 'Star' }
            ];
        }

        if (module.fields.includes('options_with_multipliers')) {
            defaultConfig.options = [
                { 
                    title: 'Standard', 
                    description: 'Standard pricing', 
                    icon: 'Star',
                    price_multiplier: 1.0 
                }
            ];
        }

        if (module.fields.includes('options_with_pricing')) {
            defaultConfig.options = [
                { 
                    title: 'Small', 
                    description: 'Small project',
                    base_price: 100,
                    estimated_hours: 2,
                    price_range_min: 80,
                    price_range_max: 150
                }
            ];
        }

        if (module.fields.includes('options_with_pricing_types')) {
            defaultConfig.options = [
                { 
                    title: 'Standard Service', 
                    description: 'Standard service option',
                    icon: 'Star',
                    pricing_type: 'fixed',
                    pricing_value: 50
                }
            ];
        }

        if (module.fields.includes('categories')) {
            defaultConfig.categories = [
                {
                    name: 'Category 1',
                    description: 'Category description',
                    icon: 'Package',
                    items: [
                        { name: 'Item 1', description: 'Item description', price: 10 }
                    ]
                }
            ];
        }

        if (module.fields.includes('cost_per_mile')) {
            defaultConfig.cost_per_mile = 4.00;
            defaultConfig.minimum_distance = 0;
        }

        if (module.fields.includes('address_label')) {
            defaultConfig.address_label = 'Address';
        }

        setData('module_configs', {
            ...data.module_configs,
            [moduleId]: defaultConfig
        });
    };

    const updateModuleConfig = (moduleId: string, field: string, value: any) => {
        setData('module_configs', {
            ...data.module_configs,
            [moduleId]: {
                ...data.module_configs[moduleId],
                [field]: value
            }
        });
    };

    const addModuleOption = (moduleId: string) => {
        const currentOptions = data.module_configs[moduleId]?.options || [];
        const module = moduleDefinitions.find(m => m.id === moduleId);
        
        let newOption: any = {
            title: `Option ${currentOptions.length + 1}`,
            description: 'Option description',
            icon: 'Star'
        };

        if (module?.fields.includes('options_with_multipliers')) {
            newOption.price_multiplier = 1.0;
        }

        if (module?.fields.includes('options_with_pricing')) {
            newOption = {
                ...newOption,
                base_price: 100,
                estimated_hours: 2,
                price_range_min: 80,
                price_range_max: 150
            };
        }

        if (module?.fields.includes('options_with_pricing_types')) {
            newOption = {
                ...newOption,
                pricing_type: 'fixed',
                pricing_value: 50
            };
        }

        updateModuleConfig(moduleId, 'options', [...currentOptions, newOption]);
    };

    const removeModuleOption = (moduleId: string, index: number) => {
        const currentOptions = data.module_configs[moduleId]?.options || [];
        const newOptions = currentOptions.filter((_: any, i: number) => i !== index);
        updateModuleConfig(moduleId, 'options', newOptions);
    };

    const updateModuleOption = (moduleId: string, optionIndex: number, field: string, value: any) => {
        const currentOptions = [...(data.module_configs[moduleId]?.options || [])];
        currentOptions[optionIndex] = {
            ...currentOptions[optionIndex],
            [field]: value
        };
        updateModuleConfig(moduleId, 'options', currentOptions);
    };

    const toggleModuleExpanded = (moduleId: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSubmit = () => {
        post(route('widgets.store'), {
            onSuccess: () => {
                window.location.href = route('dashboard');
            },
        });
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return data.name && data.company_name && data.service_category;
            case 2: return data.enabled_modules.length >= 3;
            case 3: return true; // Module configuration is optional
            case 4: return true; // Branding is pre-filled
            case 5: return true;
            default: return false;
        }
    };

    const renderModuleConfiguration = (moduleId: string) => {
        const module = moduleDefinitions.find(m => m.id === moduleId);
        const config = data.module_configs[moduleId] || {};
        const isExpanded = expandedModules.includes(moduleId);

        if (!module || !isExpanded) return null;

        return (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Title</Label>
                        <Input
                            value={config.title || ''}
                            onChange={(e) => updateModuleConfig(moduleId, 'title', e.target.value)}
                            placeholder="Module title"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            value={config.subtitle || ''}
                            onChange={(e) => updateModuleConfig(moduleId, 'subtitle', e.target.value)}
                            placeholder="Module subtitle"
                        />
                    </div>
                </div>

                {module.fields.includes('address_label') && (
                    <div>
                        <Label>Address Label</Label>
                        <Input
                            value={config.address_label || ''}
                            onChange={(e) => updateModuleConfig(moduleId, 'address_label', e.target.value)}
                            placeholder="Address field label"
                        />
                    </div>
                )}

                {module.fields.includes('cost_per_mile') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Cost Per Mile ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={config.cost_per_mile || ''}
                                onChange={(e) => updateModuleConfig(moduleId, 'cost_per_mile', parseFloat(e.target.value))}
                                placeholder="4.00"
                            />
                        </div>
                        <div>
                            <Label>Minimum Distance (miles)</Label>
                            <Input
                                type="number"
                                value={config.minimum_distance || ''}
                                onChange={(e) => updateModuleConfig(moduleId, 'minimum_distance', parseInt(e.target.value))}
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}

                {(module.fields.includes('options') || 
                  module.fields.includes('options_with_multipliers') || 
                  module.fields.includes('options_with_pricing') ||
                  module.fields.includes('options_with_pricing_types')) && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Label>Options</Label>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => addModuleOption(moduleId)}
                                className="flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Option
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {(config.options || []).map((option: any, index: number) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-sm">Option {index + 1}</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeModuleOption(moduleId, index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <div>
                                            <Label className="text-xs">Title</Label>
                                            <Input
                                                size="sm"
                                                value={option.title || ''}
                                                onChange={(e) => updateModuleOption(moduleId, index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Description</Label>
                                            <Input
                                                size="sm"
                                                value={option.description || ''}
                                                onChange={(e) => updateModuleOption(moduleId, index, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Icon</Label>
                                            <Input
                                                size="sm"
                                                value={option.icon || ''}
                                                onChange={(e) => updateModuleOption(moduleId, index, 'icon', e.target.value)}
                                                placeholder="Star"
                                            />
                                        </div>
                                    </div>

                                    {module.fields.includes('options_with_multipliers') && (
                                        <div>
                                            <Label className="text-xs">Price Multiplier</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                size="sm"
                                                value={option.price_multiplier || ''}
                                                onChange={(e) => updateModuleOption(moduleId, index, 'price_multiplier', parseFloat(e.target.value))}
                                                placeholder="1.0"
                                            />
                                        </div>
                                    )}

                                    {module.fields.includes('options_with_pricing') && (
                                        <div className="grid grid-cols-4 gap-3">
                                            <div>
                                                <Label className="text-xs">Base Price ($)</Label>
                                                <Input
                                                    type="number"
                                                    size="sm"
                                                    value={option.base_price || ''}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'base_price', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Estimated Hours</Label>
                                                <Input
                                                    type="number"
                                                    step="0.5"
                                                    size="sm"
                                                    value={option.estimated_hours || ''}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'estimated_hours', parseFloat(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Min Price ($)</Label>
                                                <Input
                                                    type="number"
                                                    size="sm"
                                                    value={option.price_range_min || ''}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'price_range_min', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Max Price ($)</Label>
                                                <Input
                                                    type="number"
                                                    size="sm"
                                                    value={option.price_range_max || ''}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'price_range_max', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {module.fields.includes('options_with_pricing_types') && (
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <Label className="text-xs">Pricing Type</Label>
                                                <select
                                                    value={option.pricing_type || 'fixed'}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'pricing_type', e.target.value)}
                                                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                                                >
                                                    <option value="fixed">Fixed Amount</option>
                                                    <option value="percentage">Percentage</option>
                                                    <option value="per_unit">Per Unit</option>
                                                    <option value="discount">Discount</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Pricing Value</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    size="sm"
                                                    value={option.pricing_value || ''}
                                                    onChange={(e) => updateModuleOption(moduleId, index, 'pricing_value', parseFloat(e.target.value))}
                                                />
                                            </div>
                                            {option.pricing_type === 'per_unit' && (
                                                <div>
                                                    <Label className="text-xs">Max Units</Label>
                                                    <Input
                                                        type="number"
                                                        size="sm"
                                                        value={option.max_units || ''}
                                                        onChange={(e) => updateModuleOption(moduleId, index, 'max_units', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Widget - Chalk" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Widget</h1>
                                <p className="text-gray-600">Build a comprehensive lead capture widget with advanced module configuration</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Step {currentStep} of {steps.length}
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-4">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <motion.div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                                            currentStep > step.id 
                                                ? 'bg-green-500 text-white' 
                                                : currentStep === step.id 
                                                ? 'bg-purple-500 text-white' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                        animate={{ 
                                            scale: currentStep === step.id ? 1.1 : 1,
                                        }}
                                        onClick={() => setCurrentStep(step.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-1 mx-2 rounded ${
                                            currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Step Content */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
                                <p className="text-gray-600">{steps[currentStep - 1].subtitle}</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Step 1: Basic Details */}
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Service Category Selection */}
                                        <div className="space-y-4">
                                            <Label className="text-lg font-medium">Service Category</Label>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {serviceCategories.map((category) => {
                                                    const Icon = category.icon;
                                                    return (
                                                        <motion.div
                                                            key={category.id}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setData('service_category', category.id)}
                                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                                data.service_category === category.id
                                                                    ? 'border-purple-500 bg-purple-50'
                                                                    : 'border-gray-200 hover:border-purple-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-start space-x-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${category.color}`}>
                                                                    <Icon className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">{category.name}</h3>
                                                                    <p className="text-gray-600 text-sm">{category.description}</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Widget Details */}
                                        <div className="space-y-6">
                                            <Label className="text-lg font-medium">Widget Details</Label>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Widget Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        placeholder="e.g., Atlanta Moving Lead Widget"
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="company_name">Company Name *</Label>
                                                    <Input
                                                        id="company_name"
                                                        value={data.company_name}
                                                        onChange={(e) => setData('company_name', e.target.value)}
                                                        placeholder="Your business name"
                                                    />
                                                    {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="service_subcategory">Service Specialty</Label>
                                                    <Input
                                                        id="service_subcategory"
                                                        value={data.service_subcategory}
                                                        onChange={(e) => setData('service_subcategory', e.target.value)}
                                                        placeholder="e.g., Residential Moving, Kitchen Remodeling"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="domain">Website Domain</Label>
                                                    <Input
                                                        id="domain"
                                                        value={data.domain}
                                                        onChange={(e) => setData('domain', e.target.value)}
                                                        placeholder="https://yourwebsite.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Module Selection */}
                                {currentStep === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-4">
                                            {moduleDefinitions.map((module) => (
                                                <div
                                                    key={module.id}
                                                    className={`p-4 border-2 rounded-lg transition-colors ${
                                                        data.enabled_modules.includes(module.id)
                                                            ? 'border-purple-200 bg-purple-50'
                                                            : 'border-gray-200'
                                                    } ${module.required ? 'opacity-75' : ''}`}
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <Checkbox
                                                            checked={data.enabled_modules.includes(module.id)}
                                                            disabled={module.required}
                                                            onClick={() => toggleModule(module.id)}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium">{module.name}</h4>
                                                                {module.required && (
                                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Required</span>
                                                                )}
                                                                {module.configurable && (
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Configurable</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600">{module.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Module Configuration */}
                                {currentStep === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-4"
                                    >
                                        <p className="text-gray-600 mb-6">Configure each enabled module. Click on a module to expand its configuration options.</p>
                                        
                                        {data.enabled_modules.map((moduleId) => {
                                            const module = moduleDefinitions.find(m => m.id === moduleId);
                                            if (!module?.configurable) return null;

                                            const isExpanded = expandedModules.includes(moduleId);

                                            return (
                                                <Card key={moduleId} className="overflow-hidden">
                                                    <div 
                                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                        onClick={() => toggleModuleExpanded(moduleId)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{module.name}</h4>
                                                                <p className="text-sm text-gray-600">{module.description}</p>
                                                            </div>
                                                            <motion.div
                                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                    
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                {renderModuleConfiguration(moduleId)}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Card>
                                            );
                                        })}
                                    </motion.div>
                                )}

                                {/* Step 4: Branding & Settings */}
                                {currentStep === 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        {/* Branding */}
                                        <div className="space-y-6">
                                            <Label className="text-lg font-medium">Branding</Label>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <Label>Primary Color</Label>
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="color"
                                                                value={data.branding.primary_color}
                                                                onChange={(e) => setData('branding', {
                                                                    ...data.branding,
                                                                    primary_color: e.target.value
                                                                })}
                                                                className="w-12 h-12 rounded-lg border border-gray-300"
                                                            />
                                                            <Input
                                                                value={data.branding.primary_color}
                                                                onChange={(e) => setData('branding', {
                                                                    ...data.branding,
                                                                    primary_color: e.target.value
                                                                })}
                                                                className="font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label>Secondary Color</Label>
                                                        <div className="flex items-center space-x-3">
                                                            <input
                                                                type="color"
                                                                value={data.branding.secondary_color}
                                                                onChange={(e) => setData('branding', {
                                                                    ...data.branding,
                                                                    secondary_color: e.target.value
                                                                })}
                                                                className="w-12 h-12 rounded-lg border border-gray-300"
                                                            />
                                                            <Input
                                                                value={data.branding.secondary_color}
                                                                onChange={(e) => setData('branding', {
                                                                    ...data.branding,
                                                                    secondary_color: e.target.value
                                                                })}
                                                                className="font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-6">
                                                    <h4 className="font-medium mb-4">Preview</h4>
                                                    <div className="bg-white rounded-lg p-4 border">
                                                        <div className="text-center space-y-4">
                                                            <div 
                                                                className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white"
                                                                style={{ backgroundColor: data.branding.primary_color }}
                                                            >
                                                                <Sparkles className="w-6 h-6" />
                                                            </div>
                                                            <h5 className="font-semibold">How can we help?</h5>
                                                            <div 
                                                                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                                                                style={{ backgroundColor: data.branding.primary_color }}
                                                            >
                                                                Get Started
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Global Settings */}
                                        <div className="space-y-6">
                                            <Label className="text-lg font-medium">Global Settings</Label>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tax_rate">Tax Rate</Label>
                                                    <Input
                                                        id="tax_rate"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.settings.tax_rate}
                                                        onChange={(e) => setData('settings', {
                                                            ...data.settings,
                                                            tax_rate: parseFloat(e.target.value)
                                                        })}
                                                        placeholder="0.08"
                                                    />
                                                    <p className="text-xs text-gray-500">As decimal (0.08 = 8%)</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="service_area_miles">Service Area (miles)</Label>
                                                    <Input
                                                        id="service_area_miles"
                                                        type="number"
                                                        value={data.settings.service_area_miles}
                                                        onChange={(e) => setData('settings', {
                                                            ...data.settings,
                                                            service_area_miles: parseInt(e.target.value)
                                                        })}
                                                        placeholder="100"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="minimum_job_price">Minimum Job Price ($)</Label>
                                                    <Input
                                                        id="minimum_job_price"
                                                        type="number"
                                                        value={data.settings.minimum_job_price}
                                                        onChange={(e) => setData('settings', {
                                                            ...data.settings,
                                                            minimum_job_price: parseFloat(e.target.value)
                                                        })}
                                                        placeholder="0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            checked={data.settings.show_price_ranges}
                                                            onClick={() => setData('settings', {
                                                                ...data.settings,
                                                                show_price_ranges: !data.settings.show_price_ranges
                                                            })}
                                                        />
                                                        <Label>Show Price Ranges</Label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">Display price ranges instead of fixed prices</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 5: Review */}
                                {currentStep === 5 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Widget Summary</h4>
                                                <div className="grid md:grid-cols-2 gap-6 text-sm">
                                                    <div>
                                                        <p><span className="font-medium">Name:</span> {data.name}</p>
                                                        <p><span className="font-medium">Company:</span> {data.company_name}</p>
                                                        <p><span className="font-medium">Category:</span> {serviceCategories.find(c => c.id === data.service_category)?.name}</p>
                                                        <p><span className="font-medium">Domain:</span> {data.domain || 'Not specified'}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className="font-medium">Enabled Modules:</span> {data.enabled_modules.length}</p>
                                                        <p><span className="font-medium">Tax Rate:</span> {(data.settings.tax_rate * 100).toFixed(1)}%</p>
                                                        <p><span className="font-medium">Service Area:</span> {data.settings.service_area_miles} miles</p>
                                                        <p><span className="font-medium">Min Job Price:</span> ${data.settings.minimum_job_price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">Enabled Modules</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.enabled_modules.map(moduleId => {
                                                        const module = moduleDefinitions.find(m => m.id === moduleId);
                                                        return (
                                                            <span key={moduleId} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                                                {module?.name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-4">
                                            <h4 className="font-semibold text-lg">Ready to create your widget?</h4>
                                            <p className="text-gray-600">Your widget will be created with all the configurations and ready to embed.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>

                                <div className="flex space-x-3">
                                    {currentStep < steps.length ? (
                                        <Button
                                            onClick={nextStep}
                                            disabled={!canProceed()}
                                            className="btn-chalk-gradient flex items-center"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={processing || !canProceed()}
                                            className="btn-chalk-gradient flex items-center"
                                        >
                                            {processing ? 'Creating...' : 'Create Widget'}
                                            <Sparkles className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}