<?php

use App\Http\Controllers\Api\WidgetConfigController;
use App\Http\Controllers\Api\EstimateController;
use App\Http\Controllers\Api\MapboxController;
use Illuminate\Support\Facades\Route;

// Public widget API (no authentication required)
Route::prefix('widget')->group(function () {
    Route::get('{widgetKey}/config', [WidgetConfigController::class, 'show'])
        ->name('api.widget.config');
});

// Public Mapbox API (no authentication required)
Route::prefix('mapbox')->group(function () {
    Route::get('suggest', [MapboxController::class, 'getAddressSuggestions'])
        ->name('api.public.mapbox.suggest');
    Route::get('directions', [MapboxController::class, 'getRouteDirections'])
        ->name('api.public.mapbox.directions');
});

// Protected user API (authentication required)
Route::middleware(['web', 'auth'])->prefix('user')->group(function () {
    Route::get('widgets/{widget}/config', [WidgetConfigController::class, 'showForUser'])
        ->name('api.user.widget.config');
    Route::post('widgets/{widget}/estimate', [EstimateController::class, 'calculate'])
        ->name('api.user.widget.estimate');
});