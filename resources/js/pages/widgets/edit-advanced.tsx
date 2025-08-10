import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    ArrowRight, 
    ArrowUpDown,
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
    Save,
    Calculator,
    Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import EstimateTestDrawer from '@/components/EstimateTestDrawer';
import { type BreadcrumbItem } from '@/types';

interface EditAdvancedWidgetProps {
    widget: {
        id: number;
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
        status: string;
    };
}

interface EditWidgetForm {
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Edit Widget', href: '#' },
];

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
    { id: 5, title: 'Review & Save', subtitle: 'Review and save your changes' },
];

export default function EditAdvancedWidget({ widget }: EditAdvancedWidgetProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [showEstimateTest, setShowEstimateTest] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [draggedModule, setDraggedModule] = useState<string | null>(null);
    
    // Component initialized
    
    const { data, setData, put, processing, errors } = useForm<EditWidgetForm>({
        name: widget.name || '',
        service_category: widget.service_category || '',
        service_subcategory: widget.service_subcategory || '',
        company_name: widget.company_name || '',
        domain: widget.domain || '',
        enabled_modules: widget.enabled_modules || ['service-selection', 'contact-info', 'review-quote'],
        module_configs: widget.module_configs || {},
        branding: {
            primary_color: widget.branding?.primary_color || '#8B5CF6',
            secondary_color: widget.branding?.secondary_color || '#EC4899',
        },
        settings: {
            tax_rate: widget.settings?.tax_rate || 0.08,
            service_area_miles: widget.settings?.service_area_miles || 100,
            minimum_job_price: widget.settings?.minimum_job_price || 0,
            show_price_ranges: widget.settings?.show_price_ranges ?? true,
        },
    });

    // Debug: Log when date-selection is enabled
    useEffect(() => {
        const hasDateSelection = data.enabled_modules.includes('date-selection');
        if (hasDateSelection) {
            console.log('✅ Date-selection module enabled in form');
        }
    }, [data.enabled_modules]);

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
        if (module?.required) {
            return;
        }
        
        const currentModules = data.enabled_modules;
        const isCurrentlyEnabled = currentModules.includes(moduleId);
        
        let newModules: string[];
        const newConfigs = { ...data.module_configs };
        
        if (isCurrentlyEnabled) {
            newModules = currentModules.filter(id => id !== moduleId);
            delete newConfigs[moduleId];
        } else {
            newModules = [...currentModules, moduleId];
            
            // Add default config if not already configured
            if (!newConfigs[moduleId]) {
                const defaultConfig = getDefaultModuleConfig(moduleId);
                newConfigs[moduleId] = defaultConfig;
            }
        }
        
        // Update local state - this will persist when the form is saved
        setData((prevData) => ({
            ...prevData,
            enabled_modules: newModules,
            module_configs: newConfigs
        }));
    };

    const getDefaultModuleConfig = (moduleId: string) => {
        const defaults: Record<string, any> = {
            'date-selection': {
                title: 'When do you need service?',
                subtitle: 'Select your preferred service date'
            },
            'time-selection': {
                title: 'What\'s your preferred start time?',
                subtitle: 'Choose your ideal time window',
                options: [
                    {
                        id: 'morning',
                        title: 'Morning (8AM-12PM)',
                        value: 'morning',
                        price_multiplier: 1.0
                    },
                    {
                        id: 'afternoon', 
                        title: 'Afternoon (12PM-4PM)',
                        value: 'afternoon',
                        price_multiplier: 1.0
                    },
                    {
                        id: 'evening',
                        title: 'Evening (4PM-8PM)', 
                        value: 'evening',
                        price_multiplier: 1.1
                    }
                ]
            },
            'origin-location': {
                title: 'Where are you moving from?',
                subtitle: 'Enter your pickup address',
                address_label: 'Pickup Address'
            },
            'target-location': {
                title: 'Where are you moving to?',
                subtitle: 'Enter your destination address', 
                address_label: 'Destination Address'
            },
            'additional-services': {
                title: 'Any additional services?',
                subtitle: 'Select any additional services you might need',
                options: []
            },
            'supply-selection': {
                title: 'Select Moving Supplies',
                subtitle: 'Choose from our professional moving supplies',
                options: []
            }
        };
        
        return defaults[moduleId] || {
            title: 'Module Title',
            subtitle: 'Module subtitle'
        };
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

    const addSupplyCategory = (moduleId: string) => {
        const currentCategories = data.module_configs[moduleId]?.categories || [];
        const newCategory = {
            name: `Category ${currentCategories.length + 1}`,
            description: 'Category description',
            icon: 'Package',
            items: []
        };
        updateModuleConfig(moduleId, 'categories', [...currentCategories, newCategory]);
    };

    const removeSupplyCategory = (moduleId: string, categoryIndex: number) => {
        const currentCategories = data.module_configs[moduleId]?.categories || [];
        const newCategories = currentCategories.filter((_: any, i: number) => i !== categoryIndex);
        updateModuleConfig(moduleId, 'categories', newCategories);
    };

    const updateSupplyCategory = (moduleId: string, categoryIndex: number, field: string, value: any) => {
        const currentCategories = [...(data.module_configs[moduleId]?.categories || [])];
        currentCategories[categoryIndex] = {
            ...currentCategories[categoryIndex],
            [field]: value
        };
        updateModuleConfig(moduleId, 'categories', currentCategories);
    };

    const addSupplyItem = (moduleId: string, categoryIndex: number) => {
        const currentCategories = [...(data.module_configs[moduleId]?.categories || [])];
        const currentItems = currentCategories[categoryIndex]?.items || [];
        const newItem = {
            name: 'New Item',
            description: 'Item description',
            price: 0
        };
        
        currentCategories[categoryIndex] = {
            ...currentCategories[categoryIndex],
            items: [...currentItems, newItem]
        };
        updateModuleConfig(moduleId, 'categories', currentCategories);
    };

    const removeSupplyItem = (moduleId: string, categoryIndex: number, itemIndex: number) => {
        const currentCategories = [...(data.module_configs[moduleId]?.categories || [])];
        const currentItems = currentCategories[categoryIndex]?.items || [];
        const newItems = currentItems.filter((_: any, i: number) => i !== itemIndex);
        
        currentCategories[categoryIndex] = {
            ...currentCategories[categoryIndex],
            items: newItems
        };
        updateModuleConfig(moduleId, 'categories', currentCategories);
    };

    const updateSupplyItem = (moduleId: string, categoryIndex: number, itemIndex: number, field: string, value: any) => {
        const currentCategories = [...(data.module_configs[moduleId]?.categories || [])];
        const currentItems = [...(currentCategories[categoryIndex]?.items || [])];
        
        currentItems[itemIndex] = {
            ...currentItems[itemIndex],
            [field]: value
        };
        
        currentCategories[categoryIndex] = {
            ...currentCategories[categoryIndex],
            items: currentItems
        };
        updateModuleConfig(moduleId, 'categories', currentCategories);
    };

    const toggleModuleExpanded = (moduleId: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    // Drag and drop handlers for module reordering
    const handleDragStart = (e: React.DragEvent, moduleId: string) => {
        setDraggedModule(moduleId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', moduleId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetModuleId: string) => {
        e.preventDefault();
        
        if (!draggedModule || draggedModule === targetModuleId) return;
        
        const currentModules = [...data.enabled_modules];
        const draggedIndex = currentModules.indexOf(draggedModule);
        const targetIndex = currentModules.indexOf(targetModuleId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Remove dragged item
            const [removed] = currentModules.splice(draggedIndex, 1);
            // Insert at target position
            currentModules.splice(targetIndex, 0, removed);
            
            // Update form data
            setData(prevData => ({
                ...prevData,
                enabled_modules: currentModules
            }));
        }
        
        setDraggedModule(null);
    };

    const handleDragEnd = () => {
        setDraggedModule(null);
    };

    const renderModuleForm = (moduleId: string) => {
        const module = moduleDefinitions.find(m => m.id === moduleId);
        const config = data.module_configs[moduleId] || {};
        
        if (!module) return null;
        
        return (
            <div className="space-y-6">
                {/* Module Header */}
                <div className="flex items-center justify-between pb-6 border-b">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedModule(null)}
                            className="flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Modules
                        </Button>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{module.name}</h3>
                            <p className="text-gray-600">{module.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {Object.keys(config).length > 0 && (
                            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                ✓ Configured
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Module Configuration Form */}
                <Card className="p-6">
                    <div className="space-y-6">
                        {/* Basic Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor={`${moduleId}-title`} className="text-base font-medium">Module Title</Label>
                                <Input
                                    id={`${moduleId}-title`}
                                    value={config.title || ''}
                                    onChange={(e) => updateModuleConfig(moduleId, 'title', e.target.value)}
                                    placeholder="Enter module title"
                                    className="mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">This appears as the main heading for this step</p>
                            </div>
                            <div>
                                <Label htmlFor={`${moduleId}-subtitle`} className="text-base font-medium">Module Subtitle</Label>
                                <Input
                                    id={`${moduleId}-subtitle`}
                                    value={config.subtitle || ''}
                                    onChange={(e) => updateModuleConfig(moduleId, 'subtitle', e.target.value)}
                                    placeholder="Enter module subtitle (optional)"
                                    className="mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">Additional context or instructions</p>
                            </div>
                        </div>
                        
                        {/* Module-Specific Fields */}
                        {renderModuleSpecificFields(moduleId, module, config)}
                    </div>
                </Card>
            </div>
        );
    };
    
    const renderModuleSpecificFields = (moduleId: string, module: any, config: any) => {
        return (
            <div className="space-y-8">
                {/* Address Label Field */}
                {module.fields.includes('address_label') && (
                    <div>
                        <Label className="text-base font-medium">Address Field Label</Label>
                        <Input
                            value={config.address_label || ''}
                            onChange={(e) => updateModuleConfig(moduleId, 'address_label', e.target.value)}
                            placeholder="e.g., Pickup Address, Destination Address"
                            className="mt-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">Label for the address input field</p>
                    </div>
                )}
                
                {/* Distance Calculation Fields */}
                {module.fields.includes('cost_per_mile') && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Distance Pricing</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-base font-medium">Cost Per Mile ($)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={config.cost_per_mile || ''}
                                    onChange={(e) => updateModuleConfig(moduleId, 'cost_per_mile', parseFloat(e.target.value))}
                                    placeholder="4.00"
                                    className="mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">Price charged per mile of distance</p>
                            </div>
                            <div>
                                <Label className="text-base font-medium">Minimum Distance (miles)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={config.minimum_distance || ''}
                                    onChange={(e) => updateModuleConfig(moduleId, 'minimum_distance', parseInt(e.target.value))}
                                    placeholder="0"
                                    className="mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum distance to charge for</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Supply Categories */}
                {module.fields.includes('categories') && renderSupplyCategories(moduleId, config)}
                
                {/* Options with different pricing types */}
                {(module.fields.includes('options') || 
                  module.fields.includes('options_with_multipliers') || 
                  module.fields.includes('options_with_pricing') ||
                  module.fields.includes('options_with_pricing_types')) && 
                  renderModuleOptions(moduleId, module, config)
                }
            </div>
        );
    };

    const handleSubmit = () => {
        console.log('💾 Saving widget changes...');
        
        // Clean up data before submission
        const cleanDomain = (domain: string | null): string | null => {
            if (!domain || domain.trim() === '') return null;
            
            const trimmed = domain.trim();
            // If it doesn't start with http:// or https://, add https://
            if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
                return `https://${trimmed}`;
            }
            return trimmed;
        };
        
        const submissionData = {
            ...data,
            domain: cleanDomain(data.domain)
        };
        
        // Data cleaned and ready for submission
        
        put(route('widgets.update', widget.id), submissionData, {
            onSuccess: () => {
                console.log('✅ Widget update successful');
                window.location.href = route('dashboard');
            },
            onError: (errors) => {
                console.error('❌ Widget update failed:', errors);
                console.error('📋 Form data that failed:', submissionData);
            }
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

    const renderSupplyCategories = (moduleId: string, config: any) => {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">Supply Categories</h4>
                        <p className="text-sm text-gray-600 mt-1">Manage your product catalog with categories and individual items</p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => addSupplyCategory(moduleId)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
                
                <div className="space-y-6">
                    {(config.categories || []).map((category: any, categoryIndex: number) => (
                        <Card key={categoryIndex} className="p-6 border-2">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                        <span className="text-lg">{categoryIndex + 1}</span>
                                    </div>
                                    <h5 className="font-semibold text-gray-900">{category.name || `Category ${categoryIndex + 1}`}</h5>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeSupplyCategory(moduleId, categoryIndex)}
                                    className="text-red-600 hover:text-red-700 border-red-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Category
                                </Button>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <Label className="text-base font-medium">Category Name</Label>
                                    <Input
                                        value={category.name || ''}
                                        onChange={(e) => updateSupplyCategory(moduleId, categoryIndex, 'name', e.target.value)}
                                        placeholder="e.g., Moving Boxes"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium">Description</Label>
                                    <Input
                                        value={category.description || ''}
                                        onChange={(e) => updateSupplyCategory(moduleId, categoryIndex, 'description', e.target.value)}
                                        placeholder="Category description"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium">Icon</Label>
                                    <Input
                                        value={category.icon || ''}
                                        onChange={(e) => updateSupplyCategory(moduleId, categoryIndex, 'icon', e.target.value)}
                                        placeholder="Package"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-base font-medium">Category Items</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addSupplyItem(moduleId, categoryIndex)}
                                        className="flex items-center"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>
                                
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {(category.items || []).map((item: any, itemIndex: number) => (
                                        <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 grid grid-cols-3 gap-3">
                                                <Input
                                                    value={item.name || ''}
                                                    onChange={(e) => updateSupplyItem(moduleId, categoryIndex, itemIndex, 'name', e.target.value)}
                                                    placeholder="Item name"
                                                />
                                                <Input
                                                    value={item.description || ''}
                                                    onChange={(e) => updateSupplyItem(moduleId, categoryIndex, itemIndex, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                />
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.price || ''}
                                                        onChange={(e) => updateSupplyItem(moduleId, categoryIndex, itemIndex, 'price', parseFloat(e.target.value))}
                                                        placeholder="0.00"
                                                        className="pl-8"
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeSupplyItem(moduleId, categoryIndex, itemIndex)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(!category.items || category.items.length === 0) && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No items in this category yet</p>
                                            <p className="text-sm mt-1">Click "Add Item" to get started</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                    
                    {(!config.categories || config.categories.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No supply categories yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first category to start building your product catalog</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    const renderModuleOptions = (moduleId: string, module: any, config: any) => {
        const getOptionTypeLabel = () => {
            if (module.fields.includes('options_with_multipliers')) return 'Price Multipliers';
            if (module.fields.includes('options_with_pricing')) return 'Full Pricing Options';
            if (module.fields.includes('options_with_pricing_types')) return 'Flexible Pricing Options';
            return 'Options';
        };
        
        const getOptionDescription = () => {
            if (module.fields.includes('options_with_multipliers')) return 'Options that multiply the base price';
            if (module.fields.includes('options_with_pricing')) return 'Options with complete pricing details';
            if (module.fields.includes('options_with_pricing_types')) return 'Options with flexible pricing models';
            return 'Configuration options for this module';
        };
        
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">{getOptionTypeLabel()}</h4>
                        <p className="text-sm text-gray-600 mt-1">{getOptionDescription()}</p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => addModuleOption(moduleId)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(config.options || []).map((option: any, index: number) => (
                        <Card key={index} className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h5 className="font-semibold text-gray-900">Option {index + 1}</h5>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeModuleOption(moduleId, index)}
                                    className="text-red-600 hover:text-red-700 border-red-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <Label className="text-base font-medium">Option Title</Label>
                                    <Input
                                        value={option.title || ''}
                                        onChange={(e) => updateModuleOption(moduleId, index, 'title', e.target.value)}
                                        placeholder="Option title"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium">Description</Label>
                                    <Input
                                        value={option.description || ''}
                                        onChange={(e) => updateModuleOption(moduleId, index, 'description', e.target.value)}
                                        placeholder="Option description"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label className="text-base font-medium">Icon</Label>
                                    <Input
                                        value={option.icon || ''}
                                        onChange={(e) => updateModuleOption(moduleId, index, 'icon', e.target.value)}
                                        placeholder="Star"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            
                            {/* Different pricing fields based on module type */}
                            {module.fields.includes('options_with_multipliers') && (
                                <div>
                                    <Label className="text-base font-medium">Price Multiplier</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={option.price_multiplier || ''}
                                        onChange={(e) => updateModuleOption(moduleId, index, 'price_multiplier', parseFloat(e.target.value))}
                                        placeholder="1.0"
                                        className="mt-2 max-w-xs"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Multiplies the base price (1.0 = no change, 1.5 = 50% increase)</p>
                                </div>
                            )}
                            
                            {module.fields.includes('options_with_pricing') && (
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div>
                                        <Label className="text-base font-medium">Base Price ($)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={option.base_price || ''}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'base_price', parseInt(e.target.value))}
                                            placeholder="100"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-base font-medium">Estimated Hours</Label>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={option.estimated_hours || ''}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'estimated_hours', parseFloat(e.target.value))}
                                            placeholder="2.0"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-base font-medium">Min Price ($)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={option.price_range_min || ''}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'price_range_min', parseInt(e.target.value))}
                                            placeholder="80"
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-base font-medium">Max Price ($)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={option.price_range_max || ''}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'price_range_max', parseInt(e.target.value))}
                                            placeholder="150"
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {module.fields.includes('options_with_pricing_types') && (
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-base font-medium">Pricing Type</Label>
                                        <select
                                            value={option.pricing_type || 'fixed'}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'pricing_type', e.target.value)}
                                            className="w-full px-3 py-2 mt-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                                        >
                                            <option value="fixed">Fixed Amount</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="per_unit">Per Unit</option>
                                            <option value="discount">Discount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-base font-medium">Pricing Value</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={option.pricing_value || ''}
                                            onChange={(e) => updateModuleOption(moduleId, index, 'pricing_value', parseFloat(e.target.value))}
                                            placeholder={option.pricing_type === 'percentage' ? '0.15' : '50'}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {option.pricing_type === 'percentage' ? 'As decimal (0.15 = 15%)' : 
                                             option.pricing_type === 'per_unit' ? 'Price per unit' :
                                             option.pricing_type === 'discount' ? 'Discount amount' : 'Fixed price'}
                                        </p>
                                    </div>
                                    {option.pricing_type === 'per_unit' && (
                                        <div>
                                            <Label className="text-base font-medium">Max Units</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={option.max_units || ''}
                                                onChange={(e) => updateModuleOption(moduleId, index, 'max_units', parseInt(e.target.value))}
                                                placeholder="10"
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                    
                    {(!config.options || config.options.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No options configured yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first option to get started</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${widget.name} - Chalk`} />
            
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Widget</h1>
                                <p className="text-gray-600">Update your widget configuration and module settings</p>
                                <div className="mt-2 flex items-center space-x-4 text-sm">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        widget.status === 'published' 
                                            ? 'bg-green-100 text-green-700' 
                                            : widget.status === 'draft'
                                            ? 'bg-gray-100 text-gray-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {widget.status}
                                    </span>
                                </div>
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
                                                ? 'bg-primary text-primary-foreground' 
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

                    {/* Step Content - Same structure as create-advanced but with different submit button */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
                                <p className="text-gray-600">{steps[currentStep - 1].subtitle}</p>
                            </div>

                            {/* Navigation - Moved to top */}
                            <div className="flex justify-between mb-8 pb-6 border-b">
                                {currentStep === 3 && selectedModule ? (
                                    // Special navigation when in module editing mode
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">Editing module configuration</span>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex items-center"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                )}

                                <div className="flex space-x-3">
                                    {currentStep === 3 && selectedModule ? (
                                        // Save module and return to grid
                                        <Button
                                            onClick={() => setSelectedModule(null)}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save & Close
                                        </Button>
                                    ) : currentStep < steps.length ? (
                                        <Button
                                            onClick={nextStep}
                                            disabled={!canProceed()}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={processing || !canProceed()}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center"
                                        >
                                            {processing ? 'Saving...' : 'Save Changes'}
                                            <Save className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Step 1: Basic Details */}
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Widget Name</Label>
                                                <Input
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="e.g., Atlanta Moving Lead Widget"
                                                />
                                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="company_name">Company Name</Label>
                                                <Input
                                                    id="company_name"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="Your business name"
                                                />
                                                {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name}</p>}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="service_category">Service Category</Label>
                                                <select
                                                    id="service_category"
                                                    value={data.service_category}
                                                    onChange={(e) => setData('service_category', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="">Select category</option>
                                                    {serviceCategories.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="service_subcategory">Service Specialty</Label>
                                                <Input
                                                    id="service_subcategory"
                                                    value={data.service_subcategory}
                                                    onChange={(e) => setData('service_subcategory', e.target.value)}
                                                    placeholder="e.g., Full Service & Labor Only Moving"
                                                />
                                            </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {moduleDefinitions.map((module) => (
                                                <Card
                                                    key={module.id}
                                                    className={`p-4 border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
                                                        data.enabled_modules.includes(module.id)
                                                            ? 'border-primary bg-primary/5 shadow-sm'
                                                            : 'border-border hover:border-border/60'
                                                    } ${module.required ? 'opacity-90' : ''}`}
                                                    onClick={() => !module.required && toggleModule(module.id)}
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <Checkbox
                                                                checked={data.enabled_modules.includes(module.id)}
                                                                disabled={module.required}
                                                                onCheckedChange={() => {
                                                                    console.log(`🔘 Checkbox clicked for module: ${module.id}`, {
                                                                        currentlyChecked: data.enabled_modules.includes(module.id),
                                                                        willBeChecked: !data.enabled_modules.includes(module.id)
                                                                    });
                                                                    toggleModule(module.id);
                                                                }}
                                                                className="mt-0.5"
                                                            />
                                                            {module.required && (
                                                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium">
                                                                    Required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold text-sm leading-tight">{module.name}</h4>
                                                            <p className="text-xs text-gray-600 leading-relaxed">{module.description}</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Module Configuration */}
                                {currentStep === 3 && (
                                    <AnimatePresence mode="wait">
                                        {!selectedModule ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="space-y-6"
                                            >
                                                <div className="text-center mb-8">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                {isReorderMode ? 'Reorder Your Modules' : 'Configure Your Modules'}
                                                            </h3>
                                                            <p className="text-gray-600">
                                                                {isReorderMode 
                                                                    ? 'Drag and drop modules to change their order in the customer journey.'
                                                                    : 'Click on any module to configure its settings, pricing, and options.'
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-3">
                                                            {isReorderMode ? (
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => setIsReorderMode(false)}
                                                                    className="flex items-center"
                                                                >
                                                                    Done Reordering
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => setIsReorderMode(true)}
                                                                        className="flex items-center"
                                                                    >
                                                                        <ArrowUpDown className="w-4 h-4 mr-2" />
                                                                        Reorder Modules
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => setShowEstimateTest(true)}
                                                                        className="flex items-center"
                                                                    >
                                                                        <Calculator className="w-4 h-4 mr-2" />
                                                                        Test Estimate
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => window.open(`/widgets/${widget.id}/live`, '_blank')}
                                                                        className="flex items-center"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        Preview
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {isReorderMode ? (
                                                    // Reorder Mode: Drag and Drop List
                                                    <div className="max-w-2xl mx-auto">
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0">
                                                                    <ArrowUpDown className="h-5 w-5 text-blue-400" />
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm text-blue-800">
                                                                        Drag modules up or down to change their order. The first module will be shown first to customers.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2">
                                                            {data.enabled_modules.map((moduleId, index) => {
                                                                const module = moduleDefinitions.find(m => m.id === moduleId);
                                                                if (!module) return null;
                                                                
                                                                return (
                                                                    <motion.div
                                                                        key={moduleId}
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: index * 0.05 }}
                                                                        draggable
                                                                        onDragStart={(e) => handleDragStart(e, moduleId)}
                                                                        onDragOver={handleDragOver}
                                                                        onDrop={(e) => handleDrop(e, moduleId)}
                                                                        onDragEnd={handleDragEnd}
                                                                        className={`
                                                                            p-4 bg-white border-2 rounded-lg cursor-move transition-all duration-200
                                                                            ${draggedModule === moduleId 
                                                                                ? 'border-blue-300 shadow-lg scale-105 opacity-80' 
                                                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                                                            }
                                                                        `}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <div className="flex items-center mr-4">
                                                                                <ArrowUpDown className="w-5 h-5 text-gray-400" />
                                                                            </div>
                                                                            <div className="flex-1 flex items-center justify-between">
                                                                                <div className="flex items-center">
                                                                                    <span className="text-sm font-medium text-gray-500 mr-3">
                                                                                        #{index + 1}
                                                                                    </span>
                                                                                    <div>
                                                                                        <h4 className="font-semibold text-gray-900">{module.name}</h4>
                                                                                        <p className="text-sm text-gray-500">{module.description}</p>
                                                                                    </div>
                                                                                </div>
                                                                                {module.required && (
                                                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                                                                        Required
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Configuration Mode: Grid Layout
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {data.enabled_modules.map((moduleId) => {
                                                            const module = moduleDefinitions.find(m => m.id === moduleId);
                                                            if (!module?.configurable) return null;
                                                            
                                                            const config = data.module_configs[moduleId] || {};
                                                            const isConfigured = Object.keys(config).length > 0;
                                                            
                                                            return (
                                                                <motion.div
                                                                    key={moduleId}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className="cursor-pointer"
                                                                    onClick={() => setSelectedModule(moduleId)}
                                                                >
                                                                    <Card className="p-6 h-full border-2 hover:border-border/60 transition-colors">
                                                                        <div className="flex items-start justify-between mb-4">
                                                                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                                                                                <Settings className="w-6 h-6 text-secondary-foreground" />
                                                                            </div>
                                                                            {isConfigured && (
                                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                                                    ✓ Configured
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <h4 className="font-semibold text-gray-900 mb-2">{module.name}</h4>
                                                                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                                                                        
                                                                        <div className="flex items-center text-purple-600 text-sm font-medium">
                                                                            <span>Configure</span>
                                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                                        </div>
                                                                    </Card>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                                
                                                {data.enabled_modules.filter(moduleId => {
                                                    const module = moduleDefinitions.find(m => m.id === moduleId);
                                                    return module?.configurable;
                                                }).length === 0 && (
                                                    <div className="text-center py-12">
                                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                                            <Settings className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500">No configurable modules enabled</p>
                                                        <p className="text-sm text-gray-400 mt-1">Go back to Module Selection to enable modules that can be configured</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                {renderModuleForm(selectedModule)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}

                                {/* Step 4: Branding & Settings */}
                                {currentStep === 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-medium">Branding</h3>
                                                
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

                                            <div className="space-y-6">
                                                <h3 className="text-lg font-medium">Global Settings</h3>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Tax Rate (%)</Label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="1"
                                                            value={data.settings.tax_rate}
                                                            onChange={(e) => setData('settings', {
                                                                ...data.settings,
                                                                tax_rate: parseFloat(e.target.value)
                                                            })}
                                                            placeholder="0.08"
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label>Service Area (miles)</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={data.settings.service_area_miles}
                                                            onChange={(e) => setData('settings', {
                                                                ...data.settings,
                                                                service_area_miles: parseInt(e.target.value)
                                                            })}
                                                            placeholder="100"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Minimum Job Price ($)</Label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={data.settings.minimum_job_price}
                                                            onChange={(e) => setData('settings', {
                                                                ...data.settings,
                                                                minimum_job_price: parseInt(e.target.value)
                                                            })}
                                                            placeholder="200"
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2 pt-6">
                                                        <Checkbox
                                                            checked={data.settings.show_price_ranges}
                                                            onCheckedChange={(checked) => setData('settings', {
                                                                ...data.settings,
                                                                show_price_ranges: checked
                                                            })}
                                                        />
                                                        <Label>Show price ranges</Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 5: Review & Save */}
                                {currentStep === 5 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Widget Details</h4>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                        <p><span className="font-medium">Name:</span> {data.name}</p>
                                                        <p><span className="font-medium">Company:</span> {data.company_name}</p>
                                                        <p><span className="font-medium">Category:</span> {serviceCategories.find(c => c.id === data.service_category)?.name}</p>
                                                        <p><span className="font-medium">Modules:</span> {data.enabled_modules.length} enabled</p>
                                                        <p><span className="font-medium">Configured:</span> {Object.keys(data.module_configs).length} modules</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Settings</h4>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                        <p><span className="font-medium">Tax Rate:</span> {(data.settings.tax_rate * 100).toFixed(1)}%</p>
                                                        <p><span className="font-medium">Service Area:</span> {data.settings.service_area_miles} miles</p>
                                                        <p><span className="font-medium">Min Price:</span> ${data.settings.minimum_job_price}</p>
                                                        <p><span className="font-medium">Price Ranges:</span> {data.settings.show_price_ranges ? 'Shown' : 'Hidden'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-4">
                                            <h4 className="font-semibold text-lg">Ready to save your changes?</h4>
                                            <p className="text-gray-600">Your widget will be updated with all the configuration changes you've made.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* Estimate Test Drawer */}
            <EstimateTestDrawer
                isOpen={showEstimateTest}
                onClose={() => setShowEstimateTest(false)}
                widget={{
                    id: widget.id,
                    name: data.name,
                    enabled_modules: data.enabled_modules,
                    module_configs: data.module_configs,
                    pricing: widget.pricing
                }}
            />
        </AppLayout>
    );
}