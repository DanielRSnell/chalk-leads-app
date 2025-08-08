# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chalk Leads is a universal service widget builder platform that allows any service business (moving companies, kitchen remodelers, legal services, personal trainers, etc.) to create customizable lead capture widgets. The platform generates JSON configurations that match existing widget formats and provides a script tag for embedding.

## Architecture Stack

- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: Inertia.js + React 19 + TypeScript
- **UI Components**: ShadCN UI components with Radix UI primitives  
- **Database**: SQLite (development)
- **Styling**: TailwindCSS 4.0 + ShadCN theme system
- **Build**: Vite with Laravel plugin
- **Testing**: Pest (PHP), ESLint + TypeScript (Frontend)
- **Form Validation**: Zod + React Hook Form (planned)

## Development Commands

### Frontend Development
```bash
# Start development server (runs Laravel serve + queue + logs + vite)
composer dev

# Start with SSR support  
composer dev:ssr

# Frontend only development
npm run dev

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Code quality
npm run lint        # ESLint with auto-fix
npm run format      # Prettier formatting
npm run format:check # Check formatting
npm run types       # TypeScript checking
```

### Backend Development
```bash
# Run tests
composer test
# OR
php artisan test

# Database operations
php artisan migrate
php artisan migrate:fresh --seed
php artisan tinker

# Queue management
php artisan queue:listen --tries=1

# Code formatting
./vendor/bin/pint    # Laravel Pint
```

## Core Architecture Patterns

### Widget Configuration System
The platform uses a modular approach where each service business can select from universal modules:

**Core Required Modules:**
- `service-selection`: What services do you offer?
- `contact-info`: Lead capture details
- `review-quote`: Final summary and pricing

**Universal Optional Modules:**
- `service-type`: Specific service variations
- `project-scope`: Size/complexity selection  
- `timeline-planning`: When do they want to start?
- `location-services`: Service area, on-site vs remote
- `budget-range`: Price range selection
- `project-details`: Specific requirements
- `additional-services`: Upsells and add-ons
- `consultation-type`: In-person, virtual, phone
- `urgency-level`: How soon do they need service?
- `customer-type`: First time or repeat customer
- `ai-chat`: Voiceflow integration for complex questions

### Database Architecture
Key models and relationships:
- **Widget** (hasMany: WidgetStep, WidgetLead, WidgetPricing)
- **WidgetStep** (belongsTo: Widget) 
- **WidgetLead** (belongsTo: Widget)
- **WidgetPricing** (belongsTo: Widget)
- **WidgetTemplate** (belongsTo: User)

### Configuration JSON Output Format
The system generates JSON that matches the existing widget format:
```json
{
  "widget_id": "unique_key",
  "steps_data": {
    "step_key": {
      "id": "step_key",
      "title": "Step Title", 
      "options": [...],
      "buttons": {...},
      "layout": {...},
      "validation": {...}
    }
  },
  "step_order": ["welcome", "service-selection", "contact-info"],
  "branding": {
    "primary_color": "#F4C443",
    "company_name": "Company Name"
  },
  "pricing": {...}
}
```

## Key Implementation Details

### React/Inertia Setup
- Uses React 19 with automatic JSX runtime
- Inertia.js for seamless Laravel/React integration  
- TypeScript strict mode enabled
- ShadCN UI components pre-configured

### ShadCN Integration
Components are configured in `components.json` with:
- Base path: `@/components` 
- Utils: `@/lib/utils`
- CSS variables for theming
- Lucide React for icons

### Form-Based Configuration Approach
The platform uses a simplified 6-step wizard instead of complex drag-and-drop:
1. **Service Business Setup**: Name, category, domain, company
2. **Universal Module Selection**: Choose relevant modules  
3. **Configure Selected Modules**: Simple forms for each module
4. **Service Branding**: Colors, logo, company info
5. **Pricing Setup**: Service-specific pricing rules
6. **Review & Publish**: Preview and generate embed code

### File Structure Conventions
```
app/
├── Http/Controllers/
│   ├── Api/                    # Public widget & protected user APIs
│   └── WidgetBuilderController.php
├── Models/                     # Eloquent models
├── Filament/                   # Admin panel (future)
└── Services/                   # Business logic services

resources/js/
├── pages/                      # Inertia pages
├── components/
│   ├── ui/                     # ShadCN components
│   └── WidgetConfig/           # Configuration wizard components
├── layouts/                    # Page layouts
├── lib/                        # Utilities
└── types/                      # TypeScript definitions
```

## API Endpoints Structure

### Public Widget API (no auth required)
```
GET  /api/widget/{widgetKey}/config    # Widget configuration
POST /api/widget/{widgetKey}/leads     # Lead submission
```

### Protected User API (auth required)  
```
GET|POST    /api/user/widgets           # Widget CRUD
PUT         /api/user/widgets/{id}      # Update widget
GET         /api/user/widgets/{id}/leads # Widget leads
```

## Development Workflow

### Working with Database
- Use SQLite for development (database/database.sqlite)
- Migrations are in `database/migrations/`
- Models use standard Laravel conventions
- Use `php artisan migrate:fresh --seed` to reset database

### Working with React Components
- Follow ShadCN patterns for UI components
- Use TypeScript for all new components
- Import UI components from `@/components/ui/`
- Use React Hook Form + Zod for form validation (when implemented)

### Widget Integration Testing
The generated configuration should work with the existing widget codebase. Test by:
1. Creating a widget through the builder
2. Getting the JSON configuration from the API
3. Verifying it matches the expected widget format
4. Testing with the widget embed system

## Important Notes

### Service Categories
The platform supports these primary service industries:
- Moving Services (residential, commercial, labor-only)
- Home Services (kitchen, bathroom, roofing, HVAC)
- Professional Services (legal, accounting, real estate)
- Health & Wellness (training, nutrition, therapy)
- Business Services (marketing, web design, consulting)
- Local Services (cleaning, landscaping, handyman)

### Module System Design
Each module represents a step in the lead qualification flow. Modules are:
- Self-contained with their own configuration
- Reusable across different service types
- Stored as JSON in the `widget_steps` table
- Rendered dynamically by the frontend widget

### Embed System (Future)
Widgets will be embedded via script tags:
```html
<script src="https://app.chalkleads.com/widget.js" 
        data-widget-key="YOUR_KEY"
        data-domain="YOUR_DOMAIN">
</script>
```

### Form-First Approach Benefits
- Faster widget creation (~10 minutes vs hours)
- Mobile-friendly configuration
- Familiar UX (everyone knows forms)
- Easy to maintain and extend
- Better for non-technical users