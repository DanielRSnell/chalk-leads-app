import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, Loader2, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';

interface RouteCalculationProps {
  pickupAddress: string;
  destinationAddress: string;
  onComplete: (data: {
    routeDistance: number;
    routeDuration: number;
    routeData: RouteData;
  }) => void;
}

interface RouteData {
  distance?: {
    miles: number;
    meters: number;
    text: string;
  };
  duration?: {
    minutes: number;
    seconds: number;
    text: string;
  };
  pickup_coordinates?: {
    longitude: number;
    latitude: number;
  };
  destination_coordinates?: {
    longitude: number;
    latitude: number;
  };
  geometry?: any;
}

export function RouteCalculation({ pickupAddress, destinationAddress, onComplete }: RouteCalculationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (pickupAddress && destinationAddress) {
      calculateRoute();
    }
  }, [pickupAddress, destinationAddress]);


  const calculateRoute = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗺️ Calculating route from:', pickupAddress, 'to:', destinationAddress);
      
      const url = `/api/mapbox/directions?pickup=${encodeURIComponent(pickupAddress)}&destination=${encodeURIComponent(destinationAddress)}`;
      
      console.log('🔍 Fetching route from:', url);
      
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Route calculated:', data);
      
      setRouteData(data);
      setShowConfirmation(true);
      
      // Automatically call onComplete after showing the result briefly
      setTimeout(() => {
        const distance = data?.distance?.miles || 10;
        const duration = data?.duration?.minutes || 20;
        
        console.log('✅ Auto-completing route:', { distance, duration });
        
        onComplete({
          routeDistance: distance,
          routeDuration: duration,
          routeData: data || {}
        });
      }, 2000); // Show result for 2 seconds then auto-advance
      
    } catch (err) {
      console.error('❌ Route calculation error:', err);
      setError((err as Error).message);
      
      // Show confirmation with default distance after error
      const fallbackData = {
        distance: { miles: 10, meters: 16093, text: '10 miles (estimated)' },
        duration: { minutes: 20, seconds: 1200, text: '20 min (estimated)' }
      };
      setRouteData(fallbackData);
      setShowConfirmation(true);
      
      // Auto-advance even with error after showing the result
      setTimeout(() => {
        console.log('✅ Auto-completing route with fallback data');
        onComplete({
          routeDistance: 10,
          routeDuration: 20,
          routeData: fallbackData
        });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Route Calculation Issue
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We couldn't calculate the exact route, but we'll use an estimated distance for your quote.
          </p>
        </div>
        
        <div className="animate-pulse text-sm text-muted-foreground">
          Continuing with estimate...
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Calculating Route
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We're calculating the driving distance between your locations to provide an accurate estimate.
          </p>
        </div>
        
        <div className="space-y-3 w-full max-w-sm">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm font-medium text-foreground truncate">
                {pickupAddress}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Navigation className="w-5 h-5 text-primary animate-pulse" />
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">To</p>
              <p className="text-sm font-medium text-foreground truncate">
                {destinationAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmation && routeData) {
    const distance = routeData?.distance?.miles || 10;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Route Calculated</h2>
          <p className="text-lg font-medium text-primary">
            Distance: {routeData?.distance?.text || `${distance.toFixed(1)} miles`}
          </p>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-lg p-5 border shadow-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground mb-1">Pickup</h4>
                <p className="text-sm text-muted-foreground break-words leading-relaxed">
                  {pickupAddress}
                </p>
              </div>
            </div>
            
            <div className="border-t border-border"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground mb-1">Destination</h4>
                <p className="text-sm text-muted-foreground break-words leading-relaxed">
                  {destinationAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action and Auto-advance */}
        <div className="text-center space-y-3">
          <button
            onClick={() => {
              // Reset to recalculate
              setShowConfirmation(false);
              setRouteData(null);
              calculateRoute();
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Recalculate Route
          </button>
          
          <div className="text-xs text-muted-foreground animate-pulse">
            Continuing automatically...
          </div>
        </div>
      </div>
    );
  }

  return null;
}