# Chalk Leads - Widget Builder Platform Documentation

## Project Overview

The Chalk Leads platform is a universal service widget builder that allows any service business to create customizable lead capture widgets. From moving companies to kitchen remodelers, legal services to personal trainers - users can build tailored multi-step lead qualification flows, configure service-specific pricing, and receive a script tag to embed their widget.

## Architecture Stack

- **Backend**: Laravel 11
- **Admin Panel**: Filament 3
- **Frontend**: Inertia.js + React + ShadCN UI
- **Database**: MySQL/SQLite
- **Styling**: TailwindCSS + ShadCN Components
- **Build**: Vite
- **Form Validation**: Zod + React Hook Form

## Core Concept

The platform generates JSON configurations that match the format used by the existing lead widget from `/src/data/`. The widget consumes these JSON endpoints to dynamically build the lead capture flow.

## Database Schema Design

### Core Tables

#### 1. Users Table (Enhanced)
```sql
users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    subscription_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

#### 2. Widgets Table
```sql
widgets (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(255),
    service_category VARCHAR(100), -- 'moving-services', 'home-services', etc.
    service_subcategory VARCHAR(100), -- 'kitchen-remodeling', 'residential-moving', etc.
    domain VARCHAR(255),
    company_name VARCHAR(255),
    status ENUM('draft', 'published', 'paused') DEFAULT 'draft',
    widget_key VARCHAR(32) UNIQUE, -- Used for API endpoints
    embed_domain VARCHAR(255), -- Allowed embedding domain
    enabled_modules JSON, -- Array of enabled module keys
    branding JSON, -- Colors, fonts, company info
    settings JSON, -- General widget settings
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

#### 3. Widget Steps Table
```sql
widget_steps (
    id BIGINT PRIMARY KEY,
    widget_id BIGINT,
    step_key VARCHAR(50), -- 'welcome', 'move-size', etc.
    title VARCHAR(255),
    subtitle VARCHAR(255) NULL,
    prompt JSON, -- { message, type }
    options JSON, -- Array of step options
    buttons JSON, -- Primary/secondary buttons
    layout JSON, -- Layout configuration
    validation JSON, -- Validation rules
    order_index INTEGER,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
)
```

#### 4. Widget Pricing Table
```sql
widget_pricing (
    id BIGINT PRIMARY KEY,
    widget_id BIGINT,
    category VARCHAR(50), -- 'moveSize', 'serviceType', 'laborType'
    pricing_rules JSON, -- Matches base-rates.json structure
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
)
```

#### 5. Widget Leads Table
```sql
widget_leads (
    id BIGINT PRIMARY KEY,
    widget_id BIGINT,
    lead_data JSON, -- Complete form submission
    contact_info JSON, -- Name, email, phone extracted
    estimated_value DECIMAL(10,2), -- Calculated pricing
    status ENUM('new', 'contacted', 'converted', 'lost') DEFAULT 'new',
    source_url VARCHAR(500), -- Where the lead came from
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
)
```

#### 6. Widget Templates Table
```sql
widget_templates (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    niche VARCHAR(100),
    template_data JSON, -- Complete widget configuration
    is_public BOOLEAN DEFAULT false,
    created_by BIGINT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
)
```

## API Endpoints Structure

### Public Widget API (No Authentication)

#### Get Widget Configuration
```
GET /api/widget/{widget_key}/config
```
**Response Structure:**
```json
{
    "widget_id": "abc123",
    "steps_data": {
        "welcome": {
            "id": "welcome",
            "title": "How can we help?",
            "options": [...],
            "buttons": {...},
            "layout": {...},
            "validation": {...}
        },
        // ... other steps
    },
    "step_order": ["welcome", "service-type", "..."],
    "branding": {
        "primary_color": "#F4C443",
        "company_name": "Your Company",
        "logo_url": null
    },
    "pricing": {
        "moveSize": {...},
        "serviceType": {...}
    }
}
```

#### Submit Lead
```
POST /api/widget/{widget_key}/leads
```
**Request:**
```json
{
    "lead_data": {
        "serviceType": "full-service",
        "moveSize": "2-bedroom",
        // ... complete form data
    },
    "contact_info": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "(555) 123-4567"
    },
    "estimated_value": 650.00,
    "source_url": "https://example.com/page",
    "metadata": {
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0..."
    }
}
```

### Protected User API (Authenticated)

#### Widget Management
```
GET /api/user/widgets          # List user's widgets
POST /api/user/widgets         # Create new widget
PUT /api/user/widgets/{id}     # Update widget
DELETE /api/user/widgets/{id}  # Delete widget
```

#### Widget Steps Management
```
GET /api/user/widgets/{id}/steps          # Get widget steps
POST /api/user/widgets/{id}/steps         # Add step
PUT /api/user/widgets/{id}/steps/{step_id} # Update step
DELETE /api/user/widgets/{id}/steps/{step_id} # Remove step
PUT /api/user/widgets/{id}/steps/reorder   # Reorder steps
```

#### Lead Management
```
GET /api/user/widgets/{id}/leads          # Get widget leads
PUT /api/user/leads/{lead_id}/status      # Update lead status
GET /api/user/leads/{lead_id}             # Get lead details
```

## Filament Admin Resources

### 1. Widget Resource
**Fields:**
- Name (TextInput)
- Domain (TextInput) 
- Niche (Select with predefined options)
- Status (Select)
- Branding (JSON Editor or custom form)
- Created/Updated timestamps

**Relations:**
- Steps (HasMany)
- Leads (HasMany)
- Pricing (HasMany)

**Actions:**
- Preview Widget
- Generate Embed Code
- Duplicate Widget
- Publish/Unpublish

### 2. Widget Step Resource
**Fields:**
- Step Key (Select from predefined list)
- Title/Subtitle
- Prompt configuration
- Options (Repeater field)
- Buttons configuration
- Layout settings
- Validation rules
- Order index
- Enabled toggle

### 3. Lead Resource
**Fields:**
- Widget name
- Contact information
- Lead data (JSON viewer)
- Estimated value
- Status
- Source URL
- Created date

**Filters:**
- Widget
- Status
- Date range
- Value range

### 4. Template Resource
**Fields:**
- Name
- Description
- Niche
- Public toggle
- Usage count

**Actions:**
- Apply to Widget
- Clone Template

## Widget Configuration Interface (Inertia + React)

### Page Structure

#### 1. Dashboard (`/dashboard`)
- Widget overview cards
- Recent leads
- Analytics summary
- Quick actions

#### 2. Widget List (`/widgets`)
- Table of user's widgets
- Create new widget button
- Search and filtering

#### 3. Widget Configuration (`/widgets/{id}/configure`)
- **Multi-step form wizard** with the following steps:
  1. **Basic Info**: Name, niche, domain
  2. **Module Selection**: Enable/disable widget steps
  3. **Step Configuration**: Configure each enabled step
  4. **Branding**: Colors, company info, logo
  5. **Pricing Setup**: Configure pricing rules
  6. **Review & Publish**: Preview and generate embed code

#### 4. Leads Management (`/widgets/{id}/leads`)
- Lead list with filtering
- Lead details modal
- Export functionality
- Status management

### Key React Components

#### Widget Configuration Components
```tsx
// Main configuration wizard
<WidgetConfigWizard>
  <BasicInfoStep />
  <ModuleSelectionStep />
  <StepConfigurationStep />
  <BrandingStep />
  <PricingStep />
  <ReviewStep />
</WidgetConfigWizard>

// Individual form steps
<ModuleSelectionStep>
  <ModuleToggle stepKey="welcome" />
  <ModuleToggle stepKey="labor-type" />
  <ModuleToggle stepKey="move-size" />
  // ... other modules
</ModuleSelectionStep>
```

## JSON Configuration Format

### Widget Configuration
```json
{
    "widget_id": "unique_key",
    "steps_data": {
        "step_key": {
            "id": "step_key",
            "title": "Step Title",
            "subtitle": "Optional subtitle",
            "prompt": {
                "message": "Prompt message",
                "type": "avatar|text"
            },
            "options": [
                {
                    "id": "option_id",
                    "value": "option_value",
                    "title": "Option Title",
                    "description": "Option description",
                    "icon": "IconName",
                    "type": "service|size|boolean"
                }
            ],
            "buttons": {
                "primary": {
                    "text": "Continue",
                    "action": "auto|next|submit"
                },
                "secondary": {
                    "text": "Secondary action",
                    "action": "custom_action"
                }
            },
            "layout": {
                "type": "grid|list|cards",
                "columns": 1,
                "centered": true
            },
            "validation": {
                "required": true,
                "field": "fieldName",
                "errorMessage": "Custom error message"
            }
        }
    },
    "step_order": ["welcome", "service-type", "..."],
    "branding": {
        "primary_color": "#F4C443",
        "secondary_color": "#1A1A1A",
        "company_name": "Company Name",
        "logo_url": "https://example.com/logo.png",
        "font_family": "Inter"
    }
}
```

### Pricing Configuration
```json
{
    "moveSize": {
        "studio": {
            "basePrice": 350,
            "hours": 3,
            "description": "Studio apartment"
        }
    },
    "serviceType": {
        "full-service": {
            "multiplier": 1.0,
            "description": "Full service"
        }
    }
}
```

## Widget Embed System

### Script Tag Generation
```html
<script>
(function() {
    var script = document.createElement('script');
    script.src = 'https://app.chalkleads.com/widget.js';
    script.setAttribute('data-widget-key', 'YOUR_WIDGET_KEY');
    script.setAttribute('data-domain', 'YOUR_DOMAIN');
    document.head.appendChild(script);
})();
</script>
```

### Widget Loader (`widget.js`)
```javascript
// Validates domain and loads widget
(function() {
    const widgetKey = document.currentScript.getAttribute('data-widget-key');
    const domain = document.currentScript.getAttribute('data-domain');
    
    // Fetch widget configuration
    fetch(`/api/widget/${widgetKey}/config`)
        .then(response => response.json())
        .then(config => {
            // Initialize widget with configuration
            initializeWidget(config);
        });
})();
```

## Development Workflow

### Phase 1: Backend Foundation
1. Set up Laravel with Filament
2. Create database migrations
3. Build API endpoints
4. Create basic Filament resources

### Phase 2: Widget Builder Interface
1. Set up Inertia + React
2. Build dashboard interface
3. Create widget builder components
4. Implement step designer

### Phase 3: Widget Integration
1. Create widget embed system
2. Build widget loader script
3. Test with existing widget code
4. Implement lead submission

### Phase 4: Advanced Features
1. Template system
2. Analytics dashboard
3. A/B testing
4. Advanced customization

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── WidgetConfigController.php
│   │   │   ├── LeadSubmissionController.php
│   │   │   └── UserWidgetController.php
│   │   └── WidgetBuilderController.php
│   ├── Requests/
│   │   ├── CreateWidgetRequest.php
│   │   ├── UpdateStepRequest.php
│   │   └── SubmitLeadRequest.php
│   └── Resources/
│       ├── WidgetResource.php
│       └── StepResource.php
├── Models/
│   ├── Widget.php
│   ├── WidgetStep.php
│   ├── WidgetPricing.php
│   ├── WidgetLead.php
│   └── WidgetTemplate.php
├── Filament/
│   ├── Resources/
│   │   ├── WidgetResource.php
│   │   ├── LeadResource.php
│   │   └── TemplateResource.php
│   └── Pages/
│       └── WidgetBuilder.php
└── Services/
    ├── WidgetConfigService.php
    ├── PricingCalculatorService.php
    └── TemplateService.php

resources/
├── js/
│   ├── Pages/
│   │   ├── Dashboard.tsx
│   │   ├── Widgets/
│   │   │   ├── Index.tsx
│   │   │   ├── Builder.tsx
│   │   │   └── Leads.tsx
│   │   └── Templates/
│   └── Components/
│       ├── WidgetBuilder/
│       │   ├── StepDesigner.tsx
│       │   ├── BrandingPanel.tsx
│       │   ├── PricingManager.tsx
│       │   └── PreviewPanel.tsx
│       └── UI/
└── views/
    └── app.blade.php

public/
├── widget.js          # Widget embed script
└── widget-loader.js   # Widget initialization
```

## Security Considerations

1. **Domain Validation**: Ensure widgets only load on authorized domains
2. **Rate Limiting**: Prevent abuse of API endpoints
3. **Data Sanitization**: Clean all user inputs
4. **CORS**: Properly configured for widget embedding
5. **Authentication**: Secure user sessions and API keys

## Next Steps

1. Create the database migrations
2. Set up the basic Laravel + Filament structure
3. Build the API endpoints
4. Create the widget builder interface
5. Implement the embed system
6. Test with the existing widget code

This documentation provides a comprehensive foundation for building the Chalk Leads widget platform, maintaining compatibility with the existing widget structure while providing a powerful, user-friendly creation interface.