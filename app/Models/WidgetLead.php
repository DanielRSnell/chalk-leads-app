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
        'form_responses',
        'estimate_breakdown',
        'base_price',
        'subtotal',
        'tax_amount',
        'total_price',
        'currency',
        'estimated_value',
        'status',
        'source_url',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'lead_data' => 'array',
        'contact_info' => 'array',
        'form_responses' => 'array',
        'estimate_breakdown' => 'array',
        'estimated_value' => 'decimal:2',
        'base_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_price' => 'decimal:2',
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

    public function getContactPhone(): string
    {
        return $this->contact_info['phone'] ?? '';
    }

    public function getFormattedTotal(): string
    {
        return '$' . number_format($this->total_price ?? 0, 2);
    }

    public function getEstimateItemCount(): int
    {
        return count($this->estimate_breakdown ?? []);
    }

    public function hasValidEstimate(): bool
    {
        return !empty($this->estimate_breakdown) && $this->total_price > 0;
    }
}
