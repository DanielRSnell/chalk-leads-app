<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetStep extends Model
{
    protected $table = 'widget_steps';

    protected $fillable = [
        'widget_id',
        'step_key',
        'title',
        'subtitle',
        'prompt',
        'options',
        'buttons',
        'layout',
        'validation',
        'order_index',
        'is_enabled',
    ];

    protected $casts = [
        'prompt' => 'array',
        'options' => 'array',
        'buttons' => 'array',
        'layout' => 'array',
        'validation' => 'array',
        'is_enabled' => 'boolean',
    ];

    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }
}
