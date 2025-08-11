<?php

use App\Http\Controllers\Api\WidgetConfigController;
use App\Http\Controllers\Api\EstimateController;
use Illuminate\Support\Facades\Route;

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API routes working']);
});

// Public widget API (no authentication required)
Route::prefix('widget')->group(function () {
    Route::get('{widgetKey}/config', [WidgetConfigController::class, 'show'])
        ->name('api.widget.config');
});

// Protected user API (authentication required)
Route::middleware(['web', 'auth'])->prefix('user')->group(function () {
    Route::get('widgets/{widget}/config', [WidgetConfigController::class, 'showForUser'])
        ->name('api.user.widget.config');
    Route::post('widgets/{widget}/estimate', [EstimateController::class, 'calculate'])
        ->name('api.user.widget.estimate');
});