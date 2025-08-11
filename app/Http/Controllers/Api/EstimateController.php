<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EstimateController extends Controller
{
    /**
     * Calculate estimate for a widget based on form responses
     */
    public function calculate(Request $request, Widget $widget)
    {
        $validator = Validator::make($request->all(), [
            'responses' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Invalid request data',
                'details' => $validator->errors()
            ], 422);
        }

        $responses = $request->input('responses', []);
        
        // Log responses for debugging
        \Log::info('Estimate calculation responses:', $responses);
        
        // Get the widget JSON configuration from the API
        $widgetConfig = $this->getWidgetConfiguration($widget);
        if (!$widgetConfig) {
            return response()->json(['error' => 'Widget configuration not found'], 404);
        }
        
        \Log::info('Widget configuration loaded:', ['steps_count' => count($widgetConfig['steps_data'] ?? [])]);
        
        $stepsData = $widgetConfig['steps_data'] ?? [];
        $estimationSettings = $widgetConfig['estimation_settings'] ?? [];
        
        // Step 1: Get base price from project-scope (room size)
        $basePrice = $this->getBasePrice($responses, $stepsData);
        $totalPrice = $basePrice;
        $breakdown = [];
        
        // Add base service to breakdown
        $breakdown[] = [
            'item' => 'Base Service',
            'description' => $this->getBasePriceDescription($responses, $stepsData),
            'price' => $basePrice,
            'type' => 'base'
        ];

        // Step 2: Apply multipliers from service selection, type, location, time
        $multipliers = $this->calculateMultipliers($responses, $stepsData);
        $multipliedPrice = $basePrice * $multipliers['total'];
        
        if ($multipliers['total'] != 1.0) {
            $multiplierChange = $multipliedPrice - $basePrice;
            $breakdown[] = [
                'item' => 'Service Adjustments',
                'description' => $multipliers['description'],
                'price' => $multiplierChange,
                'type' => 'adjustment'
            ];
            $totalPrice = $multipliedPrice;
        }

        // Step 3: Add challenge fees (stairs, elevators, etc.)
        $challengeCosts = $this->calculateChallengeFees($responses, $stepsData, $totalPrice);
        foreach ($challengeCosts as $challenge) {
            $breakdown[] = $challenge;
            $totalPrice += $challenge['price'];
        }

        // Step 4: Add distance-based pricing
        $distanceCost = $this->calculateDistanceCost($responses, $stepsData);
        if ($distanceCost > 0) {
            $breakdown[] = [
                'item' => 'Travel Distance',
                'description' => $this->getDistanceDescription($responses, $stepsData),
                'price' => $distanceCost,
                'type' => 'travel'
            ];
            $totalPrice += $distanceCost;
        }

        // Step 5: Add additional services
        $additionalServices = $this->calculateAdditionalServices($responses, $stepsData, $totalPrice);
        foreach ($additionalServices as $service) {
            $breakdown[] = $service;
            $totalPrice += $service['price'];
        }

        // Step 6: Add supply costs
        $supplyCosts = $this->calculateSupplyCosts($responses, $stepsData);
        foreach ($supplyCosts as $supply) {
            $breakdown[] = $supply;
            $totalPrice += $supply['price'];
        }

        // Step 7: Apply tax
        $taxRate = $estimationSettings['tax_rate'] ?? 0;
        if ($taxRate > 0) {
            $taxAmount = $totalPrice * $taxRate;
            $breakdown[] = [
                'item' => 'Tax',
                'description' => number_format($taxRate * 100, 1) . "% tax",
                'price' => $taxAmount,
                'type' => 'tax'
            ];
            $totalPrice += $taxAmount;
        }

        return response()->json([
            'widget_id' => $widget->id,
            'widget_name' => $widget->name,
            'total_price' => round($totalPrice, 2),
            'base_price' => $basePrice,
            'breakdown' => $breakdown,
            'responses' => $responses,
            'currency' => 'USD'
        ]);
    }
    
    /**
     * Get widget configuration from the API
     */
    private function getWidgetConfiguration(Widget $widget): ?array
    {
        try {
            // Call the same API endpoint that the frontend uses
            $controller = new \App\Http\Controllers\Api\WidgetConfigController();
            $response = $controller->showForUser($widget);
            
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getContent(), true);
            }
            
            return null;
        } catch (\Exception $e) {
            \Log::error('Failed to get widget configuration: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get base price from project-scope (room size)
     */
    private function getBasePrice(array $responses, array $stepsData): float
    {
        $projectScopeResponse = $responses['project-scope'] ?? null;
        $projectScopeStep = $stepsData['project-scope'] ?? null;
        
        if (!$projectScopeResponse || !$projectScopeStep || !isset($projectScopeResponse['selectedOption'])) {
            return 350; // Default studio price
        }
        
        $selectedOptionId = $projectScopeResponse['selectedOption'];
        $options = $projectScopeStep['options'] ?? [];
        
        foreach ($options as $option) {
            if ($option['id'] === $selectedOptionId) {
                return $option['estimation']['base_price'] ?? 350;
            }
        }
        
        return 350; // Fallback to studio price
    }
    
    /**
     * Get description for base price
     */
    private function getBasePriceDescription(array $responses, array $stepsData): string
    {
        $projectScopeResponse = $responses['project-scope'] ?? null;
        $projectScopeStep = $stepsData['project-scope'] ?? null;
        
        if (!$projectScopeResponse || !$projectScopeStep || !isset($projectScopeResponse['selectedOption'])) {
            return 'Studio move - base service';
        }
        
        $selectedOptionId = $projectScopeResponse['selectedOption'];
        $options = $projectScopeStep['options'] ?? [];
        
        foreach ($options as $option) {
            if ($option['id'] === $selectedOptionId) {
                return $option['title'] . ' move - base service';
            }
        }
        
        return 'Studio move - base service';
    }
    
    /**
     * Calculate all multipliers from service selection, type, location, time
     */
    private function calculateMultipliers(array $responses, array $stepsData): array
    {
        $totalMultiplier = 1.0;
        $descriptions = [];
        
        // Service selection multiplier (Full Service vs Labor Only)
        $serviceSelection = $responses['service-selection'] ?? null;
        if ($serviceSelection && isset($serviceSelection['selectedOption'])) {
            $result = $this->getOptionMultiplier($serviceSelection['selectedOption'], $stepsData['service-selection'] ?? []);
            if ($result['multiplier'] != 1.0) {
                $totalMultiplier *= $result['multiplier'];
                $descriptions[] = $result['title'] . ' (' . ($result['multiplier'] * 100) . '%)';
            }
        }
        
        // Service type multiplier (Loading & Unloading vs Loading Only, etc.)
        $serviceType = $responses['service-type'] ?? null;
        if ($serviceType && isset($serviceType['selectedOption'])) {
            $result = $this->getOptionMultiplier($serviceType['selectedOption'], $stepsData['service-type'] ?? []);
            if ($result['multiplier'] != 1.0) {
                $totalMultiplier *= $result['multiplier'];
                $descriptions[] = $result['title'] . ' (' . ($result['multiplier'] * 100) . '%)';
            }
        }
        
        // Location type multiplier (Residential vs Commercial)
        $locationType = $responses['location-type'] ?? null;
        if ($locationType && isset($locationType['selectedOption'])) {
            $result = $this->getOptionMultiplier($locationType['selectedOption'], $stepsData['location-type'] ?? []);
            if ($result['multiplier'] != 1.0) {
                $totalMultiplier *= $result['multiplier'];
                $descriptions[] = $result['title'] . ' (' . ($result['multiplier'] * 100) . '%)';
            }
        }
        
        // Time selection multiplier (Morning vs Evening premium)
        $timeSelection = $responses['time-selection'] ?? null;
        if ($timeSelection && isset($timeSelection['selectedOption'])) {
            $result = $this->getOptionMultiplier($timeSelection['selectedOption'], $stepsData['time-selection'] ?? []);
            if ($result['multiplier'] != 1.0) {
                $totalMultiplier *= $result['multiplier'];
                $descriptions[] = $result['title'] . ' (' . ($result['multiplier'] * 100) . '%)';
            }
        }
        
        return [
            'total' => $totalMultiplier,
            'description' => implode(', ', $descriptions)
        ];
    }
    
    /**
     * Get multiplier for a specific option
     */
    private function getOptionMultiplier(string $selectedOptionId, array $stepData): array
    {
        $options = $stepData['options'] ?? [];
        
        foreach ($options as $option) {
            if ($option['id'] === $selectedOptionId) {
                return [
                    'multiplier' => $option['estimation']['price_multiplier'] ?? 1.0,
                    'title' => $option['title'] ?? $selectedOptionId
                ];
            }
        }
        
        return ['multiplier' => 1.0, 'title' => $selectedOptionId];
    }
    
    /**
     * Calculate challenge fees (stairs, elevators, etc.)
     */
    private function calculateChallengeFees(array $responses, array $stepsData, float $baseAmount): array
    {
        $challengeFees = [];
        
        // Origin challenges
        $originChallenges = $responses['origin-challenges'] ?? null;
        if ($originChallenges && isset($originChallenges['selectedOption'])) {
            $fee = $this->processChallengeSelection($originChallenges['selectedOption'], 
                $stepsData['origin-challenges'] ?? [], $baseAmount, 'Pickup');
            if ($fee) {
                $challengeFees[] = $fee;
            }
        }
        
        // Target challenges  
        $targetChallenges = $responses['target-challenges'] ?? null;
        if ($targetChallenges && isset($targetChallenges['selectedOption'])) {
            $fee = $this->processChallengeSelection($targetChallenges['selectedOption'], 
                $stepsData['target-challenges'] ?? [], $baseAmount, 'Destination');
            if ($fee) {
                $challengeFees[] = $fee;
            }
        }
        
        return $challengeFees;
    }
    
    /**
     * Process single challenge selection and calculate fee
     */
    private function processChallengeSelection(string $selectedOptionId, array $stepData, float $baseAmount, string $location): ?array
    {
        $options = $stepData['options'] ?? [];
        
        foreach ($options as $option) {
            if ($option['id'] === $selectedOptionId) {
                $estimation = $option['estimation'] ?? [];
                $pricingType = $estimation['pricing_type'] ?? 'fixed';
                $pricingValue = $estimation['pricing_value'] ?? 0;
                
                switch ($pricingType) {
                    case 'fixed':
                        return [
                            'item' => $location . ' - ' . $option['title'],
                            'description' => $option['description'] ?? '',
                            'price' => $pricingValue,
                            'type' => 'challenge'
                        ];
                        
                    case 'percentage':
                        $amount = $baseAmount * $pricingValue;
                        return [
                            'item' => $location . ' - ' . $option['title'],
                            'description' => $option['description'] ?? '',
                            'price' => $amount,
                            'type' => 'challenge'
                        ];
                        
                    case 'discount':
                        $amount = $baseAmount * $pricingValue; // This will be negative
                        return [
                            'item' => $location . ' - ' . $option['title'],
                            'description' => $option['description'] ?? '',
                            'price' => $amount,
                            'type' => 'discount'
                        ];
                        
                    case 'per_unit':
                        // For now, use the base pricing value (would need quantity input for full implementation)
                        return [
                            'item' => $location . ' - ' . $option['title'],
                            'description' => $option['description'] ?? '',
                            'price' => $pricingValue,
                            'type' => 'challenge'
                        ];
                }
            }
        }
        
        return null;
    }
    
    /**
     * Calculate distance-based cost
     */
    private function calculateDistanceCost(array $responses, array $stepsData): float
    {
        $distanceResponse = $responses['distance-calculation'] ?? null;
        $distanceStep = $stepsData['distance-calculation'] ?? [];
        
        if (!$distanceResponse || !isset($distanceResponse['distance'])) {
            return 0;
        }
        
        $distance = (float) $distanceResponse['distance'];
        
        // Get cost per mile from step configuration
        $options = $distanceStep['options'] ?? [];
        $costPerMile = 4; // Default
        $minimumDistance = 0; // Default
        
        foreach ($options as $option) {
            if (isset($option['estimation'])) {
                $costPerMile = $option['estimation']['cost_per_mile'] ?? 4;
                $minimumDistance = $option['estimation']['minimum_distance'] ?? 0;
                break;
            }
        }
        
        if ($distance <= $minimumDistance) {
            return 0;
        }
        
        return $distance * $costPerMile;
    }
    
    /**
     * Get distance description
     */
    private function getDistanceDescription(array $responses, array $stepsData): string
    {
        $distanceResponse = $responses['distance-calculation'] ?? null;
        $distanceStep = $stepsData['distance-calculation'] ?? [];
        
        if (!$distanceResponse || !isset($distanceResponse['distance'])) {
            return 'Distance calculation';
        }
        
        $distance = (float) $distanceResponse['distance'];
        $costPerMile = 4; // Default
        
        $options = $distanceStep['options'] ?? [];
        foreach ($options as $option) {
            if (isset($option['estimation'])) {
                $costPerMile = $option['estimation']['cost_per_mile'] ?? 4;
                break;
            }
        }
        
        return number_format($distance, 1) . ' miles × $' . $costPerMile . '/mile';
    }
    
    /**
     * Calculate additional services
     */
    private function calculateAdditionalServices(array $responses, array $stepsData, float $baseAmount): array
    {
        $additionalResponse = $responses['additional-services'] ?? null;
        $additionalStep = $stepsData['additional-services'] ?? [];
        
        if (!$additionalResponse || !isset($additionalResponse['selections'])) {
            return [];
        }
        
        $services = [];
        $options = $additionalStep['options'] ?? [];
        
        foreach ($additionalResponse['selections'] as $selectionId) {
            foreach ($options as $option) {
                if ($option['id'] === $selectionId) {
                    $estimation = $option['estimation'] ?? [];
                    $pricingType = $estimation['pricing_type'] ?? 'fixed';
                    $pricingValue = $estimation['pricing_value'] ?? 0;
                    
                    switch ($pricingType) {
                        case 'fixed':
                            $services[] = [
                                'item' => $option['title'],
                                'description' => $option['description'] ?? '',
                                'price' => $pricingValue,
                                'type' => 'additional'
                            ];
                            break;
                            
                        case 'percentage':
                            $amount = $baseAmount * $pricingValue;
                            $services[] = [
                                'item' => $option['title'],
                                'description' => $option['description'] ?? '',
                                'price' => $amount,
                                'type' => 'additional'
                            ];
                            break;
                    }
                    break;
                }
            }
        }
        
        return $services;
    }
    
    /**
     * Calculate supply costs
     */
    private function calculateSupplyCosts(array $responses, array $stepsData): array
    {
        $supplyResponse = $responses['supply-selection'] ?? null;
        
        // Check if user needs supplies and has selected some
        if (!$supplyResponse || 
            (isset($supplyResponse['needsSupplies']) && !$supplyResponse['needsSupplies']) ||
            empty($supplyResponse['selectedSupplies'])) {
            return [];
        }
        
        $supplies = [];
        $selectedSupplies = $supplyResponse['selectedSupplies'];
        
        // Define supply pricing (this could come from config or database in the future)
        $supplyPricing = [
            'small-box' => ['name' => 'Small Boxes', 'price' => 2.50],
            'medium-box' => ['name' => 'Medium Boxes', 'price' => 3.75],
            'large-box' => ['name' => 'Large Boxes', 'price' => 5.00],
            'wardrobe-box' => ['name' => 'Wardrobe Boxes', 'price' => 12.00],
            'bubble-wrap' => ['name' => 'Bubble Wrap Roll', 'price' => 15.00],
            'packing-tape' => ['name' => 'Packing Tape', 'price' => 8.00],
            'packing-paper' => ['name' => 'Packing Paper', 'price' => 12.00],
        ];
        
        // Calculate cost for each selected supply
        foreach ($selectedSupplies as $supplyId => $quantity) {
            if ($quantity > 0 && isset($supplyPricing[$supplyId])) {
                $supply = $supplyPricing[$supplyId];
                $totalPrice = $supply['price'] * $quantity;
                
                $supplies[] = [
                    'item' => $supply['name'] . ' (' . $quantity . 'x)',
                    'description' => $supply['name'] . ' - $' . number_format($supply['price'], 2) . ' each × ' . $quantity,
                    'price' => $totalPrice,
                    'type' => 'supply'
                ];
            }
        }
        
        return $supplies;
    }

    /**
     * Calculate estimate for a widget using widget key (public access)
     */
    public function calculatePublic(Request $request, string $widgetKey)
    {
        // Find widget by widget_key
        $widget = Widget::where('widget_key', $widgetKey)
            ->whereIn('status', ['active', 'published'])
            ->first();
            
        if (!$widget) {
            return response()->json(['error' => 'Widget not found or not published'], 404);
        }
        
        // Use the existing calculate method logic
        return $this->calculate($request, $widget);
    }
}