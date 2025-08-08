<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetPricing extends Model
{
    protected $table = 'widget_pricing';

    protected $fillable = [
        'widget_id',
        'category',
        'pricing_rules',
    ];

    protected $casts = [
        'pricing_rules' => 'array',
    ];

    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }
}
