<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Widget;
use Illuminate\Http\JsonResponse;

class WidgetConfigController extends Controller
{
    public function show(string $widgetKey): JsonResponse
    {
        $widget = Widget::where('widget_key', $widgetKey)
            ->where('status', 'published')
            ->with(['steps', 'pricing'])
            ->first();

        if (!$widget) {
            return response()->json(['error' => 'Widget not found'], 404);
        }

        return response()->json($widget->getConfigurationArray());
    }

    public function showForUser(Widget $widget): JsonResponse
    {
        // Ensure user owns the widget
        if ($widget->company_id !== auth()->user()->company_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($widget->getConfigurationArray());
    }
}
