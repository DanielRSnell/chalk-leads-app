<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use Inertia\Inertia;
use Inertia\Response;

class WidgetLivePreviewController extends Controller
{
    /**
     * Show public live preview of widget (for iframe embedding)
     */
    public function show(Widget $widget): Response
    {
        // Only show active/published widgets publicly
        if (!in_array($widget->status, ['active', 'published'])) {
            abort(404, 'Widget not found or not published');
        }

        return Inertia::render('widgets/live-preview-public', [
            'widget' => $widget->load('company')
        ]);
    }
}