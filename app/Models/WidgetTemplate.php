<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'service_category',
        'template_data',
        'is_public',
        'created_by',
        'usage_count',
    ];

    protected $casts = [
        'template_data' => 'array',
        'is_public' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
