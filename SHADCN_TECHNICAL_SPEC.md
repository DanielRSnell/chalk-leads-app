# Chalk Leads - ShadCN UI Technical Specification

## Overview
Complete technical implementation using ShadCN UI components for the universal service widget builder.

## ShadCN Setup & Installation

### 1. Initialize ShadCN in Laravel Project
```bash
# From the project root
cd resources/js

# Initialize ShadCN
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input  
npx shadcn-ui@latest add label
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add toast
```

### 2. Updated Tailwind Config
```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './resources/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## Universal Service Widget Configuration

### 1. Service Categories & Modules Definition
```tsx
// resources/js/lib/service-categories.ts
export const SERVICE_CATEGORIES = {
  'moving-services': {
    name: 'Moving Services',
    subcategories: ['Residential Moving', 'Commercial Moving', 'Labor Only', 'Storage Solutions']
  },
  'home-services': {
    name: 'Home Services', 
    subcategories: ['Kitchen Remodeling', 'Bathroom Renovation', 'Roofing', 'HVAC', 'Flooring']
  },
  'professional-services': {
    name: 'Professional Services',
    subcategories: ['Legal Services', 'Accounting', 'Real Estate', 'Financial Planning']
  },
  'health-wellness': {
    name: 'Health & Wellness',
    subcategories: ['Personal Training', 'Nutrition', 'Therapy', 'Medical Services']
  },
  'business-services': {
    name: 'Business Services',
    subcategories: ['Marketing', 'Web Design', 'Consulting', 'Photography']
  },
  'local-services': {
    name: 'Local Services',
    subcategories: ['Cleaning', 'Landscaping', 'Pest Control', 'Handyman', 'Auto Services']
  }
};

export const UNIVERSAL_MODULES = [
  // Core modules (always included)
  { 
    key: 'service-selection', 
    title: 'Service Selection', 
    description: 'What services do you offer?',
    required: true,
    category: 'core'
  },
  { 
    key: 'contact-info', 
    title: 'Contact Information', 
    description: 'Capture customer details',
    required: true,
    category: 'core'
  },
  { 
    key: 'review-quote', 
    title: 'Review & Quote', 
    description: 'Final summary and pricing',
    required: true,
    category: 'core'
  },

  // Universal optional modules
  { 
    key: 'service-type', 
    title: 'Service Type', 
    description: 'Specific service variations',
    required: false,
    category: 'qualification'
  },
  { 
    key: 'project-scope', 
    title: 'Project Scope', 
    description: 'Size/complexity selection',
    required: false,
    category: 'qualification'
  },
  { 
    key: 'timeline-planning', 
    title: 'Timeline Planning', 
    description: 'When do they want to start?',
    required: false,
    category: 'scheduling'
  },
  { 
    key: 'location-services', 
    title: 'Location Services', 
    description: 'Service area, on-site vs remote',
    required: false,
    category: 'logistics'
  },
  { 
    key: 'budget-range', 
    title: 'Budget Range', 
    description: 'Price range selection',
    required: false,
    category: 'qualification'
  },
  { 
    key: 'project-details', 
    title: 'Project Details', 
    description: 'Specific requirements',
    required: false,
    category: 'qualification'
  },
  { 
    key: 'additional-services', 
    title: 'Additional Services', 
    description: 'Upsells and add-ons',
    required: false,
    category: 'upsell'
  },
  { 
    key: 'consultation-type', 
    title: 'Consultation Type', 
    description: 'In-person, virtual, phone',
    required: false,
    category: 'scheduling'
  },
  { 
    key: 'urgency-level', 
    title: 'Urgency Level', 
    description: 'How soon do they need service?',
    required: false,
    category: 'scheduling'
  },
  { 
    key: 'customer-type', 
    title: 'Customer Type', 
    description: 'First time or repeat customer',
    required: false,
    category: 'qualification'
  },
  { 
    key: 'ai-chat', 
    title: 'AI Chat Integration', 
    description: 'Voiceflow for complex questions',
    required: false,
    category: 'engagement'
  }
];
```

### 2. Main Configuration Wizard with ShadCN
```tsx
// resources/js/Pages/Widgets/Configure.tsx
import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Step components
import { ServiceBusinessSetup } from '@/Components/WidgetConfig/ServiceBusinessSetup';
import { UniversalModuleSelection } from '@/Components/WidgetConfig/UniversalModuleSelection';
import { ModuleConfiguration } from '@/Components/WidgetConfig/ModuleConfiguration';
import { ServiceBranding } from '@/Components/WidgetConfig/ServiceBranding';
import { UniversalPricing } from '@/Components/WidgetConfig/UniversalPricing';
import { ReviewAndPublish } from '@/Components/WidgetConfig/ReviewAndPublish';

const configurationSchema = z.object({
  name: z.string().min(1, "Widget name is required"),
  service_category: z.string().min(1, "Service category is required"),
  service_subcategory: z.string().optional(),
  domain: z.string().url().optional(),
  company_name: z.string().min(1, "Company name is required"),
  enabled_modules: z.array(z.string()).min(3, "At least 3 modules required"),
  module_configs: z.record(z.any()),
  branding: z.object({
    primary_color: z.string(),
    company_name: z.string(),
    logo_url: z.string().optional(),
  }),
  pricing: z.record(z.any()),
});

type ConfigurationFormData = z.infer<typeof configurationSchema>;

const CONFIGURATION_STEPS = [
  { 
    key: 'business', 
    title: 'Service Business Setup', 
    description: 'Basic information about your service business',
    component: ServiceBusinessSetup 
  },
  { 
    key: 'modules', 
    title: 'Select Modules', 
    description: 'Choose which steps to include in your widget',
    component: UniversalModuleSelection 
  },
  { 
    key: 'configure', 
    title: 'Configure Modules', 
    description: 'Set up each selected module',
    component: ModuleConfiguration 
  },
  { 
    key: 'branding', 
    title: 'Service Branding', 
    description: 'Customize the look and feel',
    component: ServiceBranding 
  },
  { 
    key: 'pricing', 
    title: 'Pricing Setup', 
    description: 'Configure your service pricing',
    component: UniversalPricing 
  },
  { 
    key: 'review', 
    title: 'Review & Publish', 
    description: 'Review and get your embed code',
    component: ReviewAndPublish 
  },
];

export default function WidgetConfigure() {
  const { widget } = usePage<{ widget: any }>().props;
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useReactHookForm<ConfigurationFormData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      name: widget?.name || '',
      service_category: widget?.service_category || '',
      service_subcategory: widget?.service_subcategory || '',
      domain: widget?.domain || '',
      company_name: widget?.company_name || '',
      enabled_modules: widget?.enabled_modules || ['service-selection', 'contact-info', 'review-quote'],
      module_configs: widget?.module_configs || {},
      branding: widget?.branding || {
        primary_color: '#3b82f6',
        company_name: '',
      },
      pricing: widget?.pricing || {},
    },
  });

  const { put, processing } = useForm();

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < CONFIGURATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (publish = false) => {
    const formData = form.getValues();
    put(route('widgets.update', widget.id), {
      data: {
        ...formData,
        status: publish ? 'published' : 'draft'
      }
    });
  };

  const CurrentStepComponent = CONFIGURATION_STEPS[currentStep].component;
  const progressPercentage = ((currentStep + 1) / CONFIGURATION_STEPS.length) * 100;

  return (
    <>
      <Head title={`Configure ${widget?.name || 'Widget'}`} />
      
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Widget Configuration</h1>
            <p className="text-muted-foreground mt-2">
              Set up your service widget in {CONFIGURATION_STEPS.length} easy steps
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {CONFIGURATION_STEPS.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {CONFIGURATION_STEPS.map((step, index) => (
                <div key={step.key} className="flex items-center space-x-2 whitespace-nowrap">
                  <Badge 
                    variant={index <= currentStep ? "default" : "secondary"}
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <span className={`text-sm ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                  {index < CONFIGURATION_STEPS.length - 1 && (
                    <Separator orientation="vertical" className="h-4 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle>{CONFIGURATION_STEPS[currentStep].title}</CardTitle>
              <CardDescription>
                {CONFIGURATION_STEPS[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                form={form}
                data={form.watch()}
              />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={processing}
              >
                Save Draft
              </Button>

              {currentStep === CONFIGURATION_STEPS.length - 1 ? (
                <Button
                  onClick={() => handleSave(true)}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Publish Widget
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={processing}
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

### 3. Universal Module Selection Component
```tsx
// resources/js/Components/WidgetConfig/UniversalModuleSelection.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { UNIVERSAL_MODULES } from '@/lib/service-categories';

interface UniversalModuleSelectionProps {
  form: UseFormReturn<any>;
  data: any;
}

export function UniversalModuleSelection({ form, data }: UniversalModuleSelectionProps) {
  const modulesByCategory = UNIVERSAL_MODULES.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof UNIVERSAL_MODULES>);

  const categoryLabels = {
    core: 'Core Modules',
    qualification: 'Lead Qualification',
    scheduling: 'Scheduling & Timeline',
    logistics: 'Location & Logistics', 
    upsell: 'Additional Services',
    engagement: 'Customer Engagement'
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Select the modules you want to include in your service widget. Core modules are required and cannot be disabled.
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="enabled_modules"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-6">
                {Object.entries(modulesByCategory).map(([category, modules]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{categoryLabels[category as keyof typeof categoryLabels]}</h3>
                      {category === 'core' && (
                        <Badge variant="secondary">Required</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {modules.map((module) => (
                        <Card key={module.key} className="p-4 hover:bg-accent/50 transition-colors">
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(module.key)}
                                disabled={module.required}
                                onCheckedChange={(checked) => {
                                  const updatedModules = checked
                                    ? [...(field.value || []), module.key]
                                    : field.value?.filter((value: string) => value !== module.key);
                                  field.onChange(updatedModules);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none flex-1">
                              <FormLabel className="font-medium cursor-pointer">
                                {module.title}
                                {module.required && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Required
                                  </Badge>
                                )}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {module.description}
                              </p>
                            </div>
                          </FormItem>
                        </Card>
                      ))}
                    </div>
                    
                    {category !== 'engagement' && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
```

### 4. Service Business Setup Component  
```tsx
// resources/js/Components/WidgetConfig/ServiceBusinessSetup.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

import { SERVICE_CATEGORIES } from '@/lib/service-categories';

interface ServiceBusinessSetupProps {
  form: UseFormReturn<any>;
  data: any;
}

export function ServiceBusinessSetup({ form, data }: ServiceBusinessSetupProps) {
  const selectedCategory = form.watch('service_category');
  const subcategories = selectedCategory ? SERVICE_CATEGORIES[selectedCategory]?.subcategories : [];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Widget Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Kitchen Remodeling Lead Capture" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Premier Kitchen Solutions" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="service_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your service category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {subcategories.length > 0 && (
            <FormField
              control={form.control}
              name="service_subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Specialization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website Domain (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://your-website.com" 
                  type="url"
                  {...field} 
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                The domain where this widget will be embedded. Leave blank to allow any domain.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <Card className="p-4 bg-accent/50 border-accent">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-primary text-sm font-semibold">💡</span>
          </div>
          <div>
            <h4 className="font-medium text-sm">Getting Started</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Choose your service category to get relevant module recommendations. You can always customize which modules to include in the next step.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

This specification provides a complete ShadCN-based implementation for the universal service widget builder that can work for any service business - from moving companies to kitchen remodelers to professional services.