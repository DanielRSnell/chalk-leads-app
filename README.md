# Chalk Leads App

> Multi-tenant widget-based lead capture and estimation platform

A powerful platform for creating embeddable lead capture widgets with built-in pricing estimation, lead management, and multi-tenant architecture. Perfect for service-based businesses (moving companies, contractors, etc.) to embed quote calculators on their websites.

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

## Features

- **Widget Builder**: Create customizable lead capture forms with 13+ module types
- **Smart Estimation**: Multi-factor pricing engine with distance, challenges, services, and supplies
- **Multi-tenant**: Company-scoped data isolation with Filament admin panel
- **Embeddable**: Generate iframe embed codes for any website
- **Lead Management**: Track leads from capture to conversion with status management
- **Mapbox Integration**: Address autocomplete and route calculation
- **Modern Stack**: React 19, Laravel 12, TypeScript, Inertia.js, TailwindCSS 4

## Architecture Overview

### Tech Stack

**Backend**
- Laravel 12 (PHP 8.2+)
- Filament 3.3 (Admin Panel)
- Inertia.js 2.0 (SPA bridge)
- PostgreSQL (Primary database)
- Laravel Sanctum (Authentication)

**Frontend**
- React 19 with TypeScript 5.7
- Inertia.js 2.0 (React adapter)
- TailwindCSS 4.0
- Radix UI (Component library)
- Framer Motion (Animations)
- Lucide React (Icons)

**Third-party Services**
- Mapbox (Geocoding, route calculation)

### Multi-Tenancy Architecture

**Company-Based Isolation:**
- Users belong to a company (`users.company_id`)
- All widgets and leads are scoped by company
- Data isolation enforced at the query level
- Filament provides admin panel for managing companies

**User Roles:**
- `system_admin`: Full access to Filament, all companies
- `admin`: Company admin, manages company's widgets and leads
- `user`: Standard user, view-only access

### Widget System

**How It Works:**
1. Admin creates a widget with configured modules (service selection, location, pricing, etc.)
2. Widget generates a unique `widget_key` for public access
3. Widget is embeddable via iframe: `<iframe src="/widget/{widget_key}"></iframe>`
4. Users fill out the widget form
5. System calculates estimate based on configured pricing
6. Lead is captured and stored with all form responses

**Module Types:**
- **Service Selection**: Choose service type (moving, packing, etc.)
- **Date/Time Selection**: Schedule preferred date and time
- **Location Modules**: Origin and destination addresses (Mapbox integration)
- **Distance Calculation**: Calculate distance and route cost
- **Challenges**: Stairs, elevators, narrow doorways, parking distance
- **Supply Selection**: Boxes, tape, bubble wrap with quantities
- **Additional Services**: Packing, unpacking, storage, etc.
- **Contact Info**: Capture customer details
- **Review Quote**: Final review before submission

### Estimation Engine

**Multi-Factor Pricing:**
1. **Base Price**: From project scope (room size, property type, etc.)
2. **Service Multipliers**: From service type, location type, time selection
3. **Distance Cost**: Cost per mile calculated from Mapbox routes
4. **Challenge Fees**: Stairs, elevators, narrow doorways (fixed or per-unit)
5. **Additional Services**: Fixed or percentage-based pricing
6. **Supply Costs**: Item-by-item pricing with quantities
7. **Tax Application**: Based on configured tax rate
8. **Total Calculation**: With minimum job price enforcement

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- Node.js 20 or higher
- PostgreSQL 13+
- Composer
- NPM or Yarn

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/chalk-leads-app.git
cd chalk-leads-app

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create PostgreSQL database
createdb chalk_leads_app

# Configure essential environment variables in .env
# See "Essential Environment Variables" section below for details

# Run migrations and seed sample data
php artisan migrate --seed

# Start development servers (runs Laravel, Vite, Queue, Logs concurrently)
npm run dev
```

Visit:
- Application: http://localhost:5173
- Admin Panel: http://localhost:8000/admin

**Default Credentials (from seeder):**
- Email: `admin@chalkleads.com`
- Password: `admin123`

### Essential Environment Variables

After copying `.env.example` to `.env`, configure these required variables:

#### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `APP_KEY` | Application encryption key | Auto-generated | Run `php artisan key:generate` |
| `APP_URL` | Your application URL | `http://localhost` | Your domain or localhost |
| `DB_CONNECTION` | Database driver | `pgsql` | Use `pgsql` for PostgreSQL |
| `DB_HOST` | Database host | `127.0.0.1` | Your PostgreSQL server |
| `DB_PORT` | Database port | `5432` | PostgreSQL default port |
| `DB_DATABASE` | Database name | `chalk_leads_app` | Database you created |
| `DB_USERNAME` | Database user | `postgres` | Your PostgreSQL username |
| `DB_PASSWORD` | Database password | `your_password` | Your PostgreSQL password |
| `MAPBOX_SECRET_KEY` | **REQUIRED** Mapbox API key | `pk_test_...` | [Get API key](https://account.mapbox.com/access-tokens/) |

**Note:** The application **will not work** without a valid `MAPBOX_SECRET_KEY` as it's used for:
- Address autocomplete in widget forms
- Distance calculation between origin and destination
- Route visualization

#### Optional but Recommended

| Variable | Description | Default | When to Configure |
|----------|-------------|---------|-------------------|
| `MAIL_MAILER` | Email driver | `log` | Use `smtp`, `mailgun`, `ses` for production |
| `MAIL_HOST` | SMTP server | `127.0.0.1` | When using SMTP |
| `MAIL_PORT` | SMTP port | `2525` | When using SMTP |
| `MAIL_USERNAME` | SMTP username | - | When using SMTP |
| `MAIL_PASSWORD` | SMTP password | - | When using SMTP |
| `MAIL_FROM_ADDRESS` | Sender email | `noreply@chalkleads.com` | Your domain email |
| `SESSION_DRIVER` | Session storage | `database` | Keep as `database` |
| `QUEUE_CONNECTION` | Queue driver | `database` | Keep as `database` for async jobs |

#### Development Only

These are automatically configured and don't need changes for local development:

```env
APP_NAME="Chalk Leads"
APP_ENV=local
APP_DEBUG=true
LOG_CHANNEL=stack
CACHE_STORE=database
```

### Building for Production

```bash
npm run build
php artisan optimize
```

## Deployment to Railway

Railway provides the easiest deployment path with built-in PostgreSQL and automatic builds.

### Step 1: Fork and Connect Repository

1. **Fork this repository** to your GitHub account
2. Create a [Railway account](https://railway.app) if you don't have one
3. Go to [Railway Dashboard](https://railway.app/dashboard) and click "New Project"
4. Select **"Deploy from GitHub repo"**
5. Connect your GitHub account if not already connected
6. Choose your forked repository from the list

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically create database credentials

### Step 3: Configure Environment Variables

Click on your application service in Railway, then go to the **Variables** tab and add the following:

```env
# Application
APP_NAME="Chalk Leads"
APP_ENV=production
APP_URL=https://your-app.railway.app
APP_DEBUG=false
APP_KEY=base64:...  # Generate with: php artisan key:generate --show

# Database (auto-filled by Railway PostgreSQL service)
DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Session & Queue
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Mapbox (REQUIRED - get from https://account.mapbox.com/access-tokens/)
MAPBOX_SECRET_KEY=your_mapbox_api_key

# Mail Configuration (configure for production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@chalkleads.com
MAIL_FROM_NAME="Chalk Leads"
```

### Step 4: Deploy

Railway uses the included `nixpacks.toml` configuration to automatically:
1. Install PHP and Node.js dependencies
2. Build frontend assets with Vite
3. Cache Laravel configuration and routes
4. Run database migrations

Push to GitHub and Railway will auto-deploy:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### Step 5: Post-Deployment

**Create Admin User:**

```bash
# Using Railway CLI
railway run php artisan tinker

# In tinker console
$company = App\Models\Company::create(['name' => 'Your Company', 'is_active' => true]);

$user = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@yourcompany.com',
    'password' => bcrypt('your-secure-password'),
    'company_id' => $company->id,
    'role' => 'system_admin',
    'is_active' => true,
]);
```

**Start Queue Worker (Optional):**

For background jobs (webhooks, emails), add a worker process in Railway:

1. Click **"+ New"** in your Railway project
2. Select **"Empty Service"**
3. Connect the same GitHub repository
4. In Settings → Deploy, set custom start command:
   ```bash
   php artisan queue:work --tries=3 --timeout=90
   ```

## Multi-Tenancy Explained

Chalk Leads uses a **company-based multi-tenancy** model where all data is isolated by company.

### How It Works

1. **Companies Table**: Each company has its own record with settings, branding, and subscription tier
2. **User Association**: Every user belongs to exactly one company via `users.company_id`
3. **Data Scoping**: Widgets and leads are automatically scoped to the user's company
4. **Query Isolation**: All queries filter by `company_id` to prevent cross-company data access

### Creating Companies

**Via Filament Admin Panel** (recommended):
1. Login as system admin at `/admin`
2. Navigate to Companies resource
3. Create new company with name, domain, subscription tier
4. Create users and assign to the company

**Via Database Seeder:**

```bash
php artisan db:seed --class=CompanySeeder
```

### User Role Permissions

| Role | Access |
|------|--------|
| `system_admin` | Full Filament access, all companies, all resources |
| `admin` | Company's widgets, leads, settings |
| `user` | View-only access to company's data |

## Widget System Architecture

### Creating a Widget

1. **Via Filament Admin Panel:**
   - Navigate to Widgets resource
   - Configure enabled modules
   - Set up pricing rules
   - Customize branding (colors, logo)
   - Publish widget

2. **Programmatically:**

```php
$widget = Widget::create([
    'company_id' => $company->id,
    'name' => 'Moving Quote Calculator',
    'service_category' => 'moving',
    'widget_key' => Str::random(32),
    'status' => 'published',
    'enabled_modules' => [
        'service-selection',
        'date-selection',
        'origin-location',
        'target-location',
        'distance-calculation',
        'contact-info',
        'review-quote',
    ],
    'module_configs' => [
        'service-selection' => [
            'title' => 'What service do you need?',
            'options' => [
                ['title' => 'Full Service Moving', 'pricing_type' => 'multiplier', 'pricing_value' => 1.0],
                ['title' => 'Loading & Unloading Only', 'pricing_type' => 'multiplier', 'pricing_value' => 0.6],
            ],
        ],
        // ... other module configs
    ],
    'settings' => [
        'tax_rate' => 0.08,
        'cost_per_mile' => 2.50,
        'minimum_job_price' => 200,
    ],
]);
```

### Embedding Widgets

```html
<!-- Basic Embed -->
<iframe
    src="https://yourapp.railway.app/widget/abc123xyz456"
    width="100%"
    height="800px"
    frameborder="0"
></iframe>

<!-- Responsive Embed -->
<div style="position: relative; padding-bottom: 100%; height: 0;">
    <iframe
        src="https://yourapp.railway.app/widget/abc123xyz456"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
    ></iframe>
</div>
```

### Widget Configuration Flow

1. **Module Selection**: Admin enables modules (service, location, date, etc.)
2. **Configuration**: Each module configured with options, pricing, validation
3. **Branding**: Custom colors, logo, button text
4. **Pricing Rules**: Base prices, multipliers, per-unit costs
5. **Publish**: Widget becomes publicly accessible via unique key

## Extending the Platform

### Email Notifications

Currently, the application uses the `log` mail driver. To enable email notifications when leads are captured:

#### Step 1: Configure Mail Driver

Update `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # or your SMTP server
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@chalkleads.com
MAIL_FROM_NAME="${APP_NAME}"
```

For production, use services like:
- **Mailgun**: `MAIL_MAILER=mailgun`
- **Amazon SES**: `MAIL_MAILER=ses`
- **Postmark**: `MAIL_MAILER=postmark`

#### Step 2: Create Notification

```bash
php artisan make:notification LeadReceivedNotification
```

#### Step 3: Implement Notification

```php
<?php

namespace App\Notifications;

use App\Models\WidgetLead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeadReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public WidgetLead $lead
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Lead Received - ' . $this->lead->getContactName())
            ->line('A new lead has been captured from your widget.')
            ->line('**Contact:** ' . $this->lead->getContactName())
            ->line('**Email:** ' . $this->lead->getContactEmail())
            ->line('**Phone:** ' . $this->lead->getContactPhone())
            ->line('**Total:** ' . $this->lead->getFormattedTotal())
            ->action('View Lead', url('/leads/' . $this->lead->id))
            ->line('Thank you for using Chalk Leads!');
    }
}
```

#### Step 4: Send Notification

In `app/Http/Controllers/Api/EstimateController.php`, after creating the lead:

```php
use App\Notifications\LeadReceivedNotification;

// After: $lead = WidgetLead::create([...]);

// Notify company users
$widget->company->users()->each(function ($user) use ($lead) {
    $user->notify(new LeadReceivedNotification($lead));
});
```

#### Step 5: Process Queue

Run the queue worker to process notifications asynchronously:

```bash
php artisan queue:work --tries=3
```

For production, use a process manager like Supervisor:

```ini
[program:chalk-leads-queue]
command=php /path/to/artisan queue:work --tries=3 --timeout=90
directory=/path/to/chalk-leads-app
autostart=true
autorestart=true
user=www-data
```

### Webhooks

Send lead data to external systems (CRM, Slack, Zapier) via webhooks when leads are captured.

#### Step 1: Add Webhook Fields to Companies

```bash
php artisan make:migration add_webhook_to_companies_table
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->string('webhook_url')->nullable();
            $table->string('webhook_secret')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['webhook_url', 'webhook_secret']);
        });
    }
};
```

Run migration:

```bash
php artisan migrate
```

#### Step 2: Create Webhook Job

```bash
php artisan make:job SendLeadWebhook
```

```php
<?php

namespace App\Jobs;

use App\Models\Company;
use App\Models\WidgetLead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendLeadWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public WidgetLead $lead,
        public Company $company
    ) {}

    public function handle(): void
    {
        if (!$this->company->webhook_url) {
            return;
        }

        $payload = [
            'event' => 'lead.created',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'lead_id' => $this->lead->id,
                'widget_id' => $this->lead->widget_id,
                'contact_name' => $this->lead->getContactName(),
                'contact_email' => $this->lead->getContactEmail(),
                'contact_phone' => $this->lead->getContactPhone(),
                'total_price' => $this->lead->total_price,
                'status' => $this->lead->status,
                'form_responses' => $this->lead->form_responses,
                'estimate_breakdown' => $this->lead->estimate_breakdown,
                'source_url' => $this->lead->source_url,
                'created_at' => $this->lead->created_at->toIso8601String(),
            ],
        ];

        // Generate HMAC signature for webhook verification
        $signature = hash_hmac(
            'sha256',
            json_encode($payload),
            $this->company->webhook_secret ?? ''
        );

        try {
            $response = Http::withHeaders([
                'X-Webhook-Signature' => $signature,
                'Content-Type' => 'application/json',
                'User-Agent' => 'ChalkLeads/1.0',
            ])
            ->timeout(10)
            ->post($this->company->webhook_url, $payload);

            if ($response->failed()) {
                Log::warning('Webhook failed', [
                    'company_id' => $this->company->id,
                    'lead_id' => $this->lead->id,
                    'status' => $response->status(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Webhook exception', [
                'company_id' => $this->company->id,
                'lead_id' => $this->lead->id,
                'error' => $e->getMessage(),
            ]);

            throw $e; // Re-throw to trigger retry
        }
    }
}
```

#### Step 3: Dispatch After Lead Creation

In `app/Http/Controllers/Api/EstimateController.php`:

```php
use App\Jobs\SendLeadWebhook;

// After: $lead = WidgetLead::create([...]);

if ($widget->company->webhook_url) {
    SendLeadWebhook::dispatch($lead, $widget->company);
}
```

#### Step 4: Verify Webhooks (Receiver Side)

When receiving webhooks, verify the signature:

```php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';
$secret = 'your_webhook_secret';

$expectedSignature = hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expectedSignature, $signature)) {
    http_response_code(401);
    die('Invalid signature');
}

$data = json_decode($payload, true);
// Process the webhook data
```

#### Step 5: Configure in Filament

Add webhook fields to Company resource:

```php
Forms\Components\TextInput::make('webhook_url')
    ->url()
    ->label('Webhook URL')
    ->helperText('Receive lead notifications at this URL'),

Forms\Components\TextInput::make('webhook_secret')
    ->label('Webhook Secret')
    ->helperText('Used to verify webhook authenticity')
    ->revealable(),
```

### Payment Integration (Stripe)

Accept payments for quotes directly through the widget.

#### Step 1: Install Stripe SDK

```bash
composer require stripe/stripe-php
```

#### Step 2: Configure Stripe

Add to `.env`:

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Step 3: Add Payment Fields to Leads

```bash
php artisan make:migration add_payment_fields_to_widget_leads
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('widget_leads', function (Blueprint $table) {
            $table->string('payment_status')->default('pending')->after('status');
            $table->string('payment_intent_id')->nullable()->after('payment_status');
            $table->timestamp('paid_at')->nullable()->after('payment_intent_id');
        });
    }

    public function down(): void
    {
        Schema::table('widget_leads', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'payment_intent_id', 'paid_at']);
        });
    }
};
```

```bash
php artisan migrate
```

#### Step 4: Create Payment Controller

```bash
php artisan make:controller Api/PaymentController
```

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WidgetLead;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function createPaymentIntent(Request $request, WidgetLead $lead)
    {
        if ($lead->payment_status === 'paid') {
            return response()->json(['error' => 'Lead already paid'], 400);
        }

        $paymentIntent = $this->stripe->paymentIntents->create([
            'amount' => (int)($lead->total_price * 100), // Convert to cents
            'currency' => 'usd',
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
            'metadata' => [
                'lead_id' => $lead->id,
                'widget_id' => $lead->widget_id,
                'company_id' => $lead->widget->company_id,
            ],
        ]);

        $lead->update(['payment_intent_id' => $paymentIntent->id]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig,
                config('services.stripe.webhook_secret')
            );
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;

            $lead = WidgetLead::where('payment_intent_id', $paymentIntent->id)->first();

            if ($lead) {
                $lead->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                // Optionally notify company
                // $lead->widget->company->users()->each->notify(new PaymentReceivedNotification($lead));
            }
        }

        return response()->json(['status' => 'success']);
    }
}
```

#### Step 5: Add Routes

In `routes/api.php`:

```php
Route::post('/leads/{lead}/payment-intent', [PaymentController::class, 'createPaymentIntent']);
Route::post('/stripe/webhook', [PaymentController::class, 'webhook']);
```

#### Step 6: Frontend Integration

Install Stripe.js:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Add payment form to widget review step:

```tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

function PaymentForm({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/success`,
            },
        });

        if (error) {
            console.error(error);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type="submit" disabled={!stripe}>
                Pay Now
            </button>
        </form>
    );
}

// In widget review step
const [clientSecret, setClientSecret] = useState(null);

useEffect(() => {
    if (leadId) {
        fetch(`/api/leads/${leadId}/payment-intent`, { method: 'POST' })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }
}, [leadId]);

return clientSecret && (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
    </Elements>
);
```

#### Step 7: Configure Webhook in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourapp.railway.app/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

## File Structure

```
chalk-leads-app/
├── app/
│   ├── Filament/
│   │   ├── AdminPanelProvider.php          # Filament configuration
│   │   └── Resources/
│   │       ├── CompanyResource.php         # Company management
│   │       ├── UserResource.php            # User management
│   │       └── WidgetResource.php          # Widget builder
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── EstimateController.php  # Pricing engine
│   │   │   │   ├── MapboxController.php    # Location services
│   │   │   │   └── WidgetConfigController.php
│   │   │   └── Auth/                       # Authentication controllers
│   │   └── Middleware/
│   ├── Models/
│   │   ├── Company.php                     # Tenant model
│   │   ├── User.php                        # User with roles
│   │   ├── Widget.php                      # Widget configuration
│   │   ├── WidgetLead.php                  # Captured leads
│   │   └── WidgetStep.php                  # Widget steps
│   └── Notifications/                      # Email notifications
├── database/
│   ├── migrations/                         # Database schema
│   └── seeders/                            # Sample data
├── resources/
│   ├── js/
│   │   ├── app.tsx                         # React app entry
│   │   ├── pages/
│   │   │   ├── dashboard.tsx               # Main dashboard
│   │   │   ├── widgets/
│   │   │   │   ├── index.tsx               # Widget list
│   │   │   │   ├── create.tsx              # Widget creator
│   │   │   │   └── edit.tsx                # Widget editor
│   │   │   └── leads/
│   │   │       ├── index.tsx               # Lead list
│   │   │       └── show.tsx                # Lead detail
│   │   ├── components/
│   │   │   ├── ui/                         # Radix UI components
│   │   │   ├── EstimateTestDrawer.tsx      # Widget preview
│   │   │   └── MapboxAutofill.tsx          # Address autocomplete
│   │   └── lib/
│   │       ├── leadResponseFormatter.ts    # Form response parser
│   │       └── utils.ts                    # Utilities
│   └── css/
│       └── app.css                         # Tailwind styles
├── routes/
│   ├── api.php                             # Public widget API
│   ├── web.php                             # Dashboard routes
│   └── auth.php                            # Auth routes
├── .env.example                            # Environment template
├── nixpacks.toml                           # Railway deployment config
├── vite.config.ts                          # Frontend build config
└── composer.json                           # PHP dependencies
```

## API Documentation

### Public Widget API

No authentication required. Use widget's public `widget_key`.

#### Get Widget Configuration

```http
GET /api/widget/{widgetKey}/config
```

**Response:**

```json
{
  "widget": {
    "id": 1,
    "name": "Moving Quote Calculator",
    "widget_key": "abc123...",
    "branding": {
      "primary_color": "#3B82F6",
      "secondary_color": "#10B981"
    },
    "enabled_modules": ["service-selection", "date-selection", ...],
    "module_configs": { ... }
  }
}
```

#### Calculate Estimate

```http
POST /api/widget/{widgetKey}/estimate
Content-Type: application/json

{
  "responses": {
    "service-selection": { "selectedOption": "service-selection_option_0" },
    "origin-location": { "address": "123 Main St, City, State" },
    "target-location": { "address": "456 Oak Ave, City, State" },
    "distance-calculation": { "distance": 25.5, "duration": 38 }
  }
}
```

**Response:**

```json
{
  "breakdown": [
    { "item": "Base Price", "description": "2 Bedroom", "price": 800, "type": "base" },
    { "item": "Distance", "description": "25.5 miles @ $2.50/mile", "price": 63.75, "type": "distance" },
    { "item": "Stairs", "description": "2 flights @ $45/flight", "price": 90, "type": "challenge" }
  ],
  "subtotal": 953.75,
  "tax": 76.30,
  "total": 1030.05,
  "currency": "USD"
}
```

#### Submit Lead

```http
POST /api/widget/{widgetKey}/leads
Content-Type: application/json

{
  "contact_info": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-0100"
  },
  "form_responses": { ... },
  "estimate_breakdown": [ ... ],
  "total_price": 1030.05,
  "source_url": "https://company.com/get-quote"
}
```

**Response:**

```json
{
  "success": true,
  "lead_id": 123
}
```

### Location Services

#### Address Autocomplete

```http
GET /api/mapbox/suggest?q=123+main+street&sessionToken=abc123
```

#### Route Directions

```http
GET /api/mapbox/directions?pickup=-84.42,33.66&destination=-84.29,33.88
```

### Authentication

Dashboard and admin routes use Laravel Sanctum session-based authentication.

## Development & Testing

### Run Tests

```bash
php artisan test
```

### Code Style

```bash
# PHP (Pint)
./vendor/bin/pint

# JavaScript/TypeScript
npm run lint
npm run format
```

### Type Checking

```bash
npm run type-check
```

### Build Assets

```bash
npm run build
```

## Troubleshooting

### Queue Not Processing

Ensure queue worker is running:

```bash
php artisan queue:work --tries=3
```

### Assets Not Loading

Clear cache and rebuild:

```bash
php artisan optimize:clear
npm run build
```

### Mapbox Features Not Working

Verify `MAPBOX_API_KEY` in `.env` is set and valid.

### Database Connection Failed

Check PostgreSQL credentials in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=chalk_leads_app
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Permission Errors

Ensure proper permissions on Laravel directories:

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Filament Admin Not Accessible

Make sure you have a user with `system_admin` role:

```bash
php artisan tinker
```

```php
$user = App\Models\User::first();
$user->role = 'system_admin';
$user->save();
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Follow PSR-12 for PHP code
- Use ESLint and Prettier for TypeScript/React
- Write descriptive commit messages
- Add tests for new features

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Support

For issues, questions, or contributions:

- **Issues**: [GitHub Issues](https://github.com/yourusername/chalk-leads-app/issues)
- **Documentation**: This README
- **Email**: daniel@umbral.ai

---

Built with ❤️ using Laravel, React, and modern web technologies.
