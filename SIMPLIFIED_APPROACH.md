# Chalk Leads - Universal Service Widget Builder

## Overview
This document outlines the universal service-based approach for the Chalk Leads platform - a flexible widget builder that works for any service business through modular step configuration.

## Universal Service Categories

### Primary Service Industries:
- **Moving Services**: Residential/commercial moving, labor-only, storage
- **Home Services**: Kitchen remodeling, bathroom renovation, roofing, HVAC
- **Professional Services**: Legal consultation, accounting, real estate
- **Health & Wellness**: Personal training, nutrition consulting, therapy
- **Business Services**: Marketing, web design, consulting
- **Local Services**: Cleaning, landscaping, pest control, handyman

## Configuration Wizard Flow

### Step 1: Service Business Setup
Universal business configuration:
- **Widget Name**: "Premier Kitchen Remodeling Lead Capture"
- **Service Category**: Dropdown (Home Services → Kitchen Remodeling)
- **Website Domain**: Where the widget will be embedded
- **Company Name**: For branding

### Step 2: Universal Module Selection
Flexible module system for any service business:

**Core Modules (Always Included):**
- ✅ Service Selection (Required) - What services do you offer?
- ✅ Contact Information (Required) - Capture lead details
- ✅ Review & Quote (Required) - Final summary and pricing

**Universal Optional Modules:**
- □ **Service Type** - Specific service variations (Full Kitchen vs Partial Remodel)
- □ **Project Scope** - Size/complexity (Small/Medium/Large project)
- □ **Timeline Planning** - When do they want to start? (Flexible scheduling)
- □ **Location Services** - Service area, on-site vs remote
- □ **Budget Range** - What's their budget? (Price range selection)
- □ **Project Details** - Specific requirements and preferences
- □ **Additional Services** - Upsells and add-ons
- □ **Consultation Type** - In-person, virtual, phone consultation
- □ **Urgency Level** - How soon do they need service?
- □ **Previous Experience** - First time or repeat customer
- □ **AI Chat Integration** - Voiceflow for complex questions

### Step 3: Configure Selected Modules
For each enabled module, simple forms to configure:

**Kitchen Remodeling Examples:**

**Service Selection Module:**
- Main Message: "What kitchen services do you need?"
- Service Options:
  - Full Kitchen Remodel (Complete renovation)
  - Cabinet Refacing (Update existing cabinets)
  - Countertop Installation (New countertops only)
  - Kitchen Design Consultation (Planning services)

**Project Scope Module:**
- Module Title: "What's the scope of your project?"
- Subtitle: "Help us understand the size of your kitchen project"
- Options:
  - Small Kitchen (Under 100 sq ft) - Starting at $15,000
  - Medium Kitchen (100-200 sq ft) - Starting at $25,000
  - Large Kitchen (200+ sq ft) - Starting at $40,000
  - Custom Quote Needed

**Budget Range Module:**
- Module Title: "What's your budget for this project?"
- Options:
  - $10,000 - $25,000
  - $25,000 - $50,000  
  - $50,000 - $100,000
  - $100,000+
  - I'm not sure yet

### Step 4: Branding Setup
Simple form for visual customization:
- **Primary Color**: Color picker (default: #F4C443)
- **Company Name**: Text input
- **Logo**: File upload (optional)
- **Font**: Dropdown selection

### Step 5: Pricing Configuration
Form-based pricing setup:

**Service Types:**
- Full Service: Base multiplier (1.0)
- Labor Only: Discount multiplier (0.65)

**Move Sizes:**
- Studio: Base price $350, 3 hours
- 1 Bedroom: Base price $475, 4 hours
- etc.

**Time Windows:**
- Morning: Standard rate (1.0x)
- Afternoon: Standard rate (1.0x) 
- Evening: Premium rate (1.15x)

**Distance:**
- Cost per mile: $4.00
- Minimum distance: 0 miles

### Step 6: Review & Publish
- Preview of all settings
- Generate embed script
- Publish/save draft options

## ShadCN UI Components Integration

### Required ShadCN Components:
```bash
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
```

### React Components with ShadCN Structure:
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Main wizard controller with ShadCN
<div className="max-w-4xl mx-auto p-6">
  <Progress value={(currentStep + 1) / totalSteps * 100} className="mb-8" />
  
  <Card>
    <CardHeader>
      <CardTitle>{steps[currentStep].title}</CardTitle>
      <CardDescription>{steps[currentStep].description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ConfigurationStep step={currentStep} />
    </CardContent>
  </Card>
</div>
```

### ShadCN Module Selection Form:
```tsx
// Step 2: Universal Module Selection with ShadCN
<Form {...form}>
  <div className="space-y-4">
    <FormLabel className="text-base font-semibold">Select Modules for Your Widget</FormLabel>
    
    {UNIVERSAL_MODULES.map((module) => (
      <Card key={module.key} className="p-4">
        <FormField
          control={form.control}
          name="enabled_modules"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(module.key)}
                  onCheckedChange={(checked) => {
                    const updatedModules = checked
                      ? [...(field.value || []), module.key]
                      : field.value?.filter((value: string) => value !== module.key)
                    field.onChange(updatedModules)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-medium">
                  {module.title}
                  {module.required && <Badge variant="secondary" className="ml-2">Required</Badge>}
                </FormLabel>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </div>
            </FormItem>
          )}
        />
      </Card>
    ))}
  </div>
</Form>
```

### ShadCN Service Configuration Form:
```tsx
// Step 3: Service Configuration with ShadCN
<Form {...form}>
  <div className="space-y-6">
    <FormField
      control={form.control}
      name="service_title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Selection Title</FormLabel>
          <FormControl>
            <Input placeholder="What services do you need?" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="service_options"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Options</FormLabel>
          <div className="space-y-3">
            {field.value?.map((option: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormControl>
                    <Input 
                      placeholder="Service Name"
                      value={option.title}
                      onChange={(e) => updateServiceOption(index, 'title', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <Input 
                      placeholder="Description"
                      value={option.description}
                      onChange={(e) => updateServiceOption(index, 'description', e.target.value)}
                    />
                  </FormControl>
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addServiceOption}>
              Add Service Option
            </Button>
          </div>
        </FormItem>
      )}
    />
  </div>
</Form>
```

## Database Changes Needed

### Add enabled_modules field to widgets table:
```sql
ALTER TABLE widgets ADD COLUMN enabled_modules JSON;
```

### Sample enabled_modules data:
```json
[
  "welcome",
  "move-type", 
  "move-size",
  "date-selection",
  "time-selection",
  "pickup-location",
  "destination-location",
  "contact-info",
  "review-details"
]
```

## Configuration JSON Output

The system will generate the same JSON format your widget expects:

```json
{
  "widget_id": "abc123",
  "steps_data": {
    "welcome": {
      "id": "welcome",
      "title": "How can we help you today?",
      "options": [...]
    },
    "move-size": {
      "id": "move-size", 
      "title": "What size is your move?",
      "options": [...]
    }
  },
  "step_order": ["welcome", "move-size", "contact-info", "review-details"],
  "branding": {
    "primary_color": "#F4C443",
    "company_name": "Atlanta Furniture Taxi"
  },
  "pricing": {
    "moveSize": {
      "studio": {"basePrice": 350, "hours": 3}
    }
  }
}
```

## Key Benefits of This Approach

1. **Simplicity**: No complex drag-and-drop interfaces
2. **Speed**: Users can configure widgets in under 10 minutes
3. **Maintainability**: Standard form components, easy to extend
4. **Familiar UX**: Everyone knows how to fill out forms
5. **Mobile Friendly**: Forms work well on all devices

## Implementation Priority

1. **Phase 1**: Basic info + module selection forms
2. **Phase 2**: Module configuration forms
3. **Phase 3**: Branding and pricing forms  
4. **Phase 4**: Review, preview, and embed generation
5. **Phase 5**: Lead management interface

## Example User Flow

1. User signs up and clicks "Create New Widget"
2. **Step 1**: Enters business info (2 minutes)
3. **Step 2**: Selects 8 relevant modules from list (2 minutes)
4. **Step 3**: Configures each module's options (4 minutes)  
5. **Step 4**: Sets brand colors and company name (1 minute)
6. **Step 5**: Reviews auto-generated pricing (1 minute)
7. **Step 6**: Gets embed script to add to website (30 seconds)

**Total time: ~10 minutes** vs hours with complex builders.

This approach focuses on getting users up and running quickly while still providing full customization of their lead capture widget.