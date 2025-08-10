<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MapboxController extends Controller
{
    private $secretKey;

    public function __construct()
    {
        // Store the secret key - in production this should be in .env
        $this->secretKey = env('MAPBOX_SECRET_KEY', 'sk.eyJ1IjoidW1icmFsLWFpIiwiYSI6ImNtZGdla3BzajBtZmkybG84aDA3eTM3cnQifQ.fsDXv6XG6i5s7Jz0B1TdfQ');
    }

    /**
     * Get address suggestions from Mapbox Search API
     */
    public function getAddressSuggestions(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
            'types' => 'nullable|string',
            'country' => 'nullable|string',
            'limit' => 'nullable|integer|min:1|max:10'
        ]);

        $query = $request->get('q');
        $types = $request->get('types', 'address');
        $country = $request->get('country', 'US');
        $limit = $request->get('limit', 5);

        // Use the older, more stable Mapbox Geocoding API instead of Search Box API
        // This matches what the legacy geocode_address function uses
        $params = [
            'access_token' => $this->secretKey,
            'limit' => min($limit, 10),
            'autocomplete' => 'true',
        ];

        // Add country filter if specified
        if (!empty($country)) {
            $params['country'] = strtolower($country); // us, ca, etc (lowercase for Geocoding API)
        }

        // Add types filter if specified 
        if (!empty($types) && $types !== 'address') {
            $params['types'] = $types;
        }

        $apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . urlencode($query) . '.json?' . http_build_query($params);

        // Log the API call for debugging
        Log::info('Mapbox Geocoding API Request: ' . $apiUrl);

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'ChalkLeads Laravel App'
                ])
                ->get($apiUrl);

            if (!$response->successful()) {
                Log::error('Mapbox API Error: ' . $response->status() . ' - ' . $response->body());
                return response()->json(['error' => 'Failed to fetch suggestions'], 500);
            }

            $data = $response->json();
            Log::info('Mapbox Geocoding API Response: ' . substr(json_encode($data), 0, 500) . '...');

            // Transform Geocoding API response to match the expected Search Box API format
            $transformedData = [
                'suggestions' => []
            ];

            if (isset($data['features']) && is_array($data['features'])) {
                foreach ($data['features'] as $feature) {
                    $transformedData['suggestions'][] = [
                        'name' => $feature['place_name'] ?? '',
                        'full_address' => $feature['place_name'] ?? '',
                        'place_formatted' => $feature['place_name'] ?? '',
                        'mapbox_id' => $feature['id'] ?? '',
                        'feature_type' => $feature['place_type'][0] ?? 'address',
                        'coordinates' => $feature['center'] ?? null
                    ];
                }
            }

            return response()->json($transformedData);

        } catch (\Exception $e) {
            Log::error('Mapbox API Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch suggestions'], 500);
        }
    }

    /**
     * Get route directions and distance between two addresses
     */
    public function getRouteDirections(Request $request): JsonResponse
    {
        $request->validate([
            'pickup' => 'required|string|min:5',
            'destination' => 'required|string|min:5'
        ]);

        $pickupAddress = $request->get('pickup');
        $destinationAddress = $request->get('destination');

        try {
            // First, geocode both addresses to get coordinates
            $pickupCoords = $this->geocodeAddress($pickupAddress);
            $destinationCoords = $this->geocodeAddress($destinationAddress);

            if (!$pickupCoords || !$destinationCoords) {
                return response()->json(['error' => 'Could not geocode one or both addresses'], 400);
            }

            // Build Mapbox Directions API URL
            $coordinates = $pickupCoords['longitude'] . ',' . $pickupCoords['latitude'] . ';' . 
                          $destinationCoords['longitude'] . ',' . $destinationCoords['latitude'];
            
            $params = [
                'access_token' => $this->secretKey,
                'geometries' => 'geojson',
                'overview' => 'simplified',
                'steps' => 'false'
            ];

            $apiUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/' . $coordinates . '?' . http_build_query($params);

            Log::info('Mapbox Directions API Request: ' . $apiUrl);

            $response = Http::timeout(15)
                ->withHeaders(['User-Agent' => 'ChalkLeads Laravel App'])
                ->get($apiUrl);

            if (!$response->successful()) {
                Log::error('Mapbox Directions API Error: ' . $response->status());
                return response()->json(['error' => 'Failed to get route directions'], 500);
            }

            $data = $response->json();

            // Extract useful information
            if (isset($data['routes']) && count($data['routes']) > 0) {
                $route = $data['routes'][0];
                $distanceMeters = $route['distance'];
                $durationSeconds = $route['duration'];
                
                // Convert to miles and minutes
                $distanceMiles = round($distanceMeters * 0.000621371, 1); // Convert meters to miles
                $durationMinutes = round($durationSeconds / 60);
                
                $routeInfo = [
                    'distance' => [
                        'miles' => $distanceMiles,
                        'meters' => $distanceMeters,
                        'text' => $distanceMiles . ' miles'
                    ],
                    'duration' => [
                        'minutes' => $durationMinutes,
                        'seconds' => $durationSeconds,
                        'text' => $this->formatDuration($durationMinutes)
                    ],
                    'pickup_coordinates' => $pickupCoords,
                    'destination_coordinates' => $destinationCoords,
                    'geometry' => $route['geometry'] ?? null
                ];

                return response()->json($routeInfo);
            } else {
                return response()->json(['error' => 'No route found between the addresses'], 404);
            }

        } catch (\Exception $e) {
            Log::error('Mapbox Directions Error: ' . $e->getMessage());
            return response()->json(['error' => 'Error processing route request'], 500);
        }
    }

    /**
     * Geocode an address to get coordinates
     */
    private function geocodeAddress(string $address): ?array
    {
        $params = [
            'access_token' => $this->secretKey,
            'limit' => 1
        ];

        $apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' . urlencode($address) . '.json?' . http_build_query($params);

        try {
            $response = Http::timeout(10)->get($apiUrl);

            if (!$response->successful()) {
                return null;
            }

            $data = $response->json();
            
            if (isset($data['features']) && count($data['features']) > 0) {
                $coordinates = $data['features'][0]['center'];
                return [
                    'longitude' => $coordinates[0],
                    'latitude' => $coordinates[1]
                ];
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Geocoding Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Format duration in minutes to human readable text
     */
    private function formatDuration(int $minutes): string
    {
        if ($minutes < 60) {
            return $minutes . ' min';
        } else {
            $hours = floor($minutes / 60);
            $remainingMinutes = $minutes % 60;
            if ($remainingMinutes > 0) {
                return $hours . 'h ' . $remainingMinutes . 'm';
            } else {
                return $hours . 'h';
            }
        }
    }
}