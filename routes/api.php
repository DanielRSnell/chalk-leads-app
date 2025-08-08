<?php

use App\Http\Controllers\Api\WidgetConfigController;
use Illuminate\Support\Facades\Route;

// Public widget API (no authentication required)
Route::prefix('widget')->group(function () {
    Route::get('{widgetKey}/config', [WidgetConfigController::class, 'show'])
        ->name('api.widget.config');
});