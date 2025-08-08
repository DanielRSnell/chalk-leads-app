<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetLead extends Model
{
    protected $table = 'widget_leads';

    protected $fillable = [
        'widget_id',
        'lead_data',
        'contact_info',
        'estimated_value',
        'status',
        'source_url',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'lead_data' => 'array',
        'contact_info' => 'array',
        'estimated_value' => 'decimal:2',
    ];

    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    public function getContactName(): string
    {
        return $this->contact_info['name'] ?? 'Unknown';
    }

    public function getContactEmail(): string
    {
        return $this->contact_info['email'] ?? '';
    }
}
