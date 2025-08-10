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
    Palette,
    Settings,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
    branding: {
        primary_color: string;
        secondary_color: string;
    };
}

const serviceCategories = [
    { 
        id: 'moving-services', 
        name: 'Moving Services', 
        icon: Truck, 
        color: 'bg-primary',
        description: 'Local, long-distance, and specialty moving'
    },
    { 
        id: 'home-services', 
        name: 'Home Services', 
        icon: Home, 
        color: 'bg-primary',
        description: 'Cleaning, handyman, and maintenance'
    },
    { 
        id: 'professional-services', 
        name: 'Professional Services', 
        icon: Briefcase, 
        color: 'bg-primary',
        description: 'Consulting, legal, and business services'
    },
    { 
        id: 'health-wellness', 
        name: 'Health & Wellness', 
        icon: Heart, 
        color: 'bg-primary',
        description: 'Fitness, therapy, and medical services'
    },
    { 
        id: 'business-services', 
        name: 'Business Services', 
        icon: Building2, 
        color: 'bg-primary',
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

const moduleOptions = [
    { id: 'service-selection', name: 'Service Selection', description: 'Welcome screen with service options', required: true },
    { id: 'service-type', name: 'Service Type', description: 'Detailed service type selection' },
    { id: 'location-type', name: 'Location Type', description: 'Residential, commercial, or storage' },
    { id: 'project-scope', name: 'Project Scope', description: 'Size and complexity selection' },
    { id: 'date-selection', name: 'Date Selection', description: 'Calendar date picker' },
    { id: 'time-selection', name: 'Time Selection', description: 'Time window preferences' },
    { id: 'origin-location', name: 'Pickup Location', description: 'Starting address input' },
    { id: 'origin-challenges', name: 'Pickup Challenges', description: 'Stairs, elevators, etc.' },
    { id: 'target-location', name: 'Destination', description: 'Delivery address input' },
    { id: 'target-challenges', name: 'Destination Challenges', description: 'Access difficulties' },
    { id: 'distance-calculation', name: 'Distance Calculation', description: 'Route and mileage pricing' },
    { id: 'additional-services', name: 'Additional Services', description: 'Add-on services and pricing' },
    { id: 'supply-selection', name: 'Supply Selection', description: 'Materials and supplies catalog' },
    { id: 'contact-info', name: 'Contact Information', description: 'Lead capture form', required: true },
    { id: 'review-quote', name: 'Review & Quote', description: 'Final estimate and submission', required: true },
];

const steps = [
    { id: 1, title: 'Service Category', subtitle: 'What industry are you in?' },
    { id: 2, title: 'Basic Details', subtitle: 'Tell us about your business' },
    { id: 3, title: 'Widget Modules', subtitle: 'Choose your customer journey' },
    { id: 4, title: 'Branding', subtitle: 'Make it yours' },
    { id: 5, title: 'Review', subtitle: 'Ready to launch?' },
];

export default function CreateWidget() {
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm<CreateWidgetForm>({
        name: '',
        service_category: '',
        service_subcategory: '',
        company_name: '',
        domain: '',
        enabled_modules: ['service-selection', 'contact-info', 'review-quote'],
        branding: {
            primary_color: '#8B5CF6',
            secondary_color: '#EC4899',
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

    const handleModuleToggle = (moduleId: string, required = false) => {
        if (required) return; // Can't toggle required modules
        
        const currentModules = data.enabled_modules;
        if (currentModules.includes(moduleId)) {
            setData('enabled_modules', currentModules.filter(id => id !== moduleId));
        } else {
            setData('enabled_modules', [...currentModules, moduleId]);
        }
    };

    const handleSubmit = () => {
        post(route('widgets.store'), {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return data.service_category !== '';
            case 2: return data.name && data.company_name;
            case 3: return data.enabled_modules.length >= 3;
            case 4: return true;
            case 5: return true;
            default: return false;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Widget - Chalk" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Widget</h1>
                                <p className="text-gray-600">Build a high-converting lead capture widget in just a few steps</p>
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
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                            currentStep > step.id 
                                                ? 'bg-primary text-primary-foreground' 
                                                : currentStep === step.id 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                        animate={{ 
                                            scale: currentStep === step.id ? 1.1 : 1,
                                            backgroundColor: currentStep > step.id ? '#10B981' : currentStep === step.id ? '#8B5CF6' : '#E5E7EB'
                                        }}
                                    >
                                        {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                                    </motion.div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-1 mx-2 rounded ${
                                            currentStep > step.id ? 'bg-primary' : 'bg-muted'
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
                                {/* Step 1: Service Category */}
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {serviceCategories.map((category) => {
                                                const Icon = category.icon;
                                                return (
                                                    <motion.div
                                                        key={category.id}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setData('service_category', category.id)}
                                                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                                            data.service_category === category.id
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-gray-200 hover:border-purple-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start space-x-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${category.color}`}>
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-lg">{category.name}</h3>
                                                                <p className="text-gray-600 text-sm">{category.description}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Basic Details */}
                                {currentStep === 2 && (
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
                                                <Label htmlFor="service_subcategory">Service Specialty</Label>
                                                <Input
                                                    id="service_subcategory"
                                                    value={data.service_subcategory}
                                                    onChange={(e) => setData('service_subcategory', e.target.value)}
                                                    placeholder="e.g., Residential Moving, Kitchen Remodeling"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="domain">Website Domain (Optional)</Label>
                                                <Input
                                                    id="domain"
                                                    value={data.domain}
                                                    onChange={(e) => setData('domain', e.target.value)}
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Module Selection */}
                                {currentStep === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid gap-4">
                                            {moduleOptions.map((module) => (
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
                                                            onClick={() => handleModuleToggle(module.id, module.required)}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium">{module.name}</h4>
                                                                {module.required && (
                                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Required</span>
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

                                {/* Step 4: Branding */}
                                {currentStep === 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
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
                                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Widget Details</h4>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                        <p><span className="font-medium">Name:</span> {data.name}</p>
                                                        <p><span className="font-medium">Company:</span> {data.company_name}</p>
                                                        <p><span className="font-medium">Category:</span> {serviceCategories.find(c => c.id === data.service_category)?.name}</p>
                                                        <p><span className="font-medium">Modules:</span> {data.enabled_modules.length} selected</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Branding</h4>
                                                    <div className="mt-2 space-y-2">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div 
                                                                className="w-4 h-4 rounded"
                                                                style={{ backgroundColor: data.branding.primary_color }}
                                                            ></div>
                                                            <span>{data.branding.primary_color}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <div 
                                                                className="w-4 h-4 rounded"
                                                                style={{ backgroundColor: data.branding.secondary_color }}
                                                            ></div>
                                                            <span>{data.branding.secondary_color}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center space-y-4">
                                            <h4 className="font-semibold text-lg">Ready to create your widget?</h4>
                                            <p className="text-gray-600">Your widget will be created and ready to embed on your website.</p>
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