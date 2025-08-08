<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
            'company_id' => auth()->user()->company_id,
            'status' => 'draft', // New widgets start as draft
        ]);
        
        return redirect()->route('dashboard')->with('success', 'Widget created successfully!');
    })->name('widgets.store');
    
    Route::get('widgets/{widget}/edit', function (\App\Models\Widget $widget) {
        // Ensure the widget belongs to the user's company
        if ($widget->company_id !== auth()->user()->company_id) {
            abort(403);
        }
        
        return Inertia::render('widgets/edit-advanced', [
            'widget' => $widget->load('company')
        ]);
    })->name('widgets.edit');
    
    Route::put('widgets/{widget}', function (\App\Models\Widget $widget, \Illuminate\Http\Request $request) {
        // Ensure the widget belongs to the user's company
        if ($widget->company_id !== auth()->user()->company_id) {
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
