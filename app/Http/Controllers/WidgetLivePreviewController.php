<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use Inertia\Inertia;
use Inertia\Response;

class WidgetLivePreviewController extends Controller
{
    /**
     * Show public live preview of widget (for iframe embedding)
     * Supports both widget ID and widget key for backward compatibility
     */
    public function show(string $identifier): Response
    {
        // Try to find widget by ID first (if numeric), then by widget_key
        if (is_numeric($identifier)) {
            $widget = Widget::where('id', $identifier)
                ->whereIn('status', ['active', 'published'])
                ->first();
        } else {
            $widget = Widget::where('widget_key', $identifier)
                ->whereIn('status', ['active', 'published'])
                ->first();
        }
            
        if (!$widget) {
            abort(404, 'Widget not found or not published');
        }

        return Inertia::render('widgets/live-preview-public', [
            'widget' => $widget->load('company')
        ]);
    }
}