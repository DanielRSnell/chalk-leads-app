<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\WidgetConfigController;
use App\Http\Controllers\Api\EstimateController;
use App\Http\Controllers\Api\MapboxController;
use App\Http\Controllers\WidgetLivePreviewController;

// Simple health check route with debug info
Route::get('/health', function () {
    $buildPath = public_path('build');
    $manifestPath = public_path('build/manifest.json');
    $assetsPath = public_path('build/assets');
    
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'debug' => [
            'build_dir_exists' => is_dir($buildPath),
            'manifest_exists' => file_exists($manifestPath),
            'build_contents' => is_dir($buildPath) ? array_slice(scandir($buildPath), 2) : null,
            'assets_contents' => is_dir($assetsPath) ? array_slice(scandir($assetsPath), 2, 10) : null, // First 10 files
            'public_contents' => array_slice(scandir(public_path()), 2),
            'vite_manifest' => file_exists($manifestPath) ? json_decode(file_get_contents($manifestPath), true) : 'missing',
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug'),
            'vite_hot_file' => file_exists(public_path('hot')) ? file_get_contents(public_path('hot')) : 'not found'
        ]
    ]);
});

Route::get('/', function () {
    // If user is already authenticated, redirect to dashboard
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    
    // Otherwise show login page as homepage
    return Inertia::render('auth/chalk-login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        // Redirect system administrators to Filament admin panel
        if ($user->isSystemAdmin()) {
            return redirect('/admin');
        }
        
        // Regular users see only their company's data
        if (!$user->company) {
            // User has no company assigned, show empty dashboard
            return Inertia::render('chalk-dashboard', [
                'user' => [
                    'name' => $user->name,
                    'company' => [
                        'name' => 'No Company Assigned',
                    ]
                ],
                'widgets' => [],
                'widgetCount' => 0,
                'leadCount' => 0,
                'error' => 'No company assigned to your account. Please contact an administrator.',
            ]);
        }
        
        $widgets = $user->company->widgets()->latest()->take(5)->get();
        $widgetCount = $user->company->widgets()->count();
        $leadCount = $user->company->widgets()->withCount('leads')->get()->sum('leads_count');
        
        return Inertia::render('chalk-dashboard', [
            'user' => [
                'name' => $user->name,
                'company' => [
                    'name' => $user->company->name,
                ]
            ],
            'widgets' => $widgets->map(fn($widget) => [
                'id' => $widget->id,
                'name' => $widget->name,
                'widget_key' => $widget->widget_key,
                'status' => $widget->status,
                'created_at' => $widget->created_at->format('M j, Y'),
            ]),
            'widgetCount' => $widgetCount,
            'leadCount' => $leadCount,
        ]);
    })->name('dashboard');
    
    // Widget management routes
    Route::get('widgets/create', function () {
        return Inertia::render('widgets/create-advanced');
    })->name('widgets.create');
    
    Route::post('widgets', function (\Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        // System admins cannot create widgets (they manage, not create)
        if ($user->isSystemAdmin()) {
            return redirect()->route('dashboard')->with('error', 'System administrators cannot create widgets.');
        }
        
        // Regular users must have a company
        if (!$user->company_id) {
            return redirect()->route('dashboard')->with('error', 'You must be assigned to a company to create widgets.');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'service_category' => 'required|string',
            'service_subcategory' => 'nullable|string|max:255',
            'company_name' => 'required|string|max:255',
            'domain' => 'nullable|url',
            'enabled_modules' => 'required|array',
            'module_configs' => 'nullable|array',
            'branding' => 'required|array',
            'branding.primary_color' => 'required|string',
            'branding.secondary_color' => 'required|string',
            'settings' => 'required|array',
            'settings.tax_rate' => 'required|numeric|min:0|max:1',
            'settings.service_area_miles' => 'required|integer|min:0',
            'settings.minimum_job_price' => 'required|numeric|min:0',
            'settings.show_price_ranges' => 'required|boolean',
        ]);
        
        $widget = \App\Models\Widget::create([
            ...$validated,
            'company_id' => $user->company_id,
            'status' => 'draft', // New widgets start as draft
        ]);
        
        return redirect()->route('dashboard')->with('success', 'Widget created successfully!');
    })->name('widgets.store');
    
    Route::get('widgets/{widget}/edit', function (\App\Models\Widget $widget) {
        $user = auth()->user();
        
        // System admins can view any widget, regular users only their company's
        if (!$user->isSystemAdmin() && $widget->company_id !== $user->company_id) {
            abort(403);
        }
        
        return Inertia::render('widgets/edit-advanced', [
            'widget' => $widget->load('company')
        ]);
    })->name('widgets.edit');
    
    Route::put('widgets/{widget}', function (\App\Models\Widget $widget, \Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        // System admins can edit any widget, regular users only their company's
        if (!$user->isSystemAdmin() && $widget->company_id !== $user->company_id) {
            abort(403);
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'service_category' => 'required|string',
            'service_subcategory' => 'nullable|string|max:255',
            'company_name' => 'required|string|max:255',
            'domain' => 'nullable|url',
            'enabled_modules' => 'required|array',
            'module_configs' => 'nullable|array',
            'branding' => 'required|array',
            'branding.primary_color' => 'required|string',
            'branding.secondary_color' => 'required|string',
            'settings' => 'required|array',
            'settings.tax_rate' => 'required|numeric|min:0|max:1',
            'settings.service_area_miles' => 'required|integer|min:0',
            'settings.minimum_job_price' => 'required|numeric|min:0',
            'settings.show_price_ranges' => 'required|boolean',
        ]);
        
        $widget->update($validated);
        
        return redirect()->route('dashboard')->with('success', 'Widget updated successfully!');
    })->name('widgets.update');
    
    // Live Preview Route (authenticated - for preview/editing)
    Route::get('widgets/{widget}/preview', function (\App\Models\Widget $widget) {
        $user = auth()->user();
        
        // Check permissions: system admins can view any, users can only view their company's widgets
        if (!$user->isSystemAdmin() && $widget->company_id !== $user->company_id) {
            abort(403);
        }
        
        return Inertia::render('widgets/live-preview', [
            'widget' => $widget->load('company')
        ]);
    })->name('widgets.preview');
});

// Public widget live preview route (no auth required, for iframe embedding)
Route::get('widgets/{widget}/live', [WidgetLivePreviewController::class, 'show'])
    ->name('widgets.live.public');

// Web-based API endpoints for widget testing
Route::middleware(['auth'])->prefix('api/user')->group(function () {
    Route::get('widgets/{widget}/config', [WidgetConfigController::class, 'showForUser'])
        ->name('api.user.widget.config');
    Route::post('widgets/{widget}/estimate', [EstimateController::class, 'calculate'])
        ->name('api.user.widget.estimate');
    
    // Mapbox API endpoints for address autocomplete and route calculation
    Route::get('mapbox/suggest', [MapboxController::class, 'getAddressSuggestions'])
        ->name('api.user.mapbox.suggest');
    Route::get('mapbox/directions', [MapboxController::class, 'getRouteDirections'])
        ->name('api.user.mapbox.directions');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
