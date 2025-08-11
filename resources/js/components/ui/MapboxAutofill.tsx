import React, { useState, useRef, useEffect } from 'react';
import { MapPin, AlertTriangle, Check, Loader2 } from 'lucide-react';

interface MapboxAutofillProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelected?: (addressData: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: {
      longitude: number;
      latitude: number;
    };
  }) => void;
  placeholder: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

interface MapboxSuggestion {
  mapbox_id?: string;
  id?: string;
  full_address?: string;
  place_formatted?: string;
  address?: string;
  name?: string;
  place_name?: string;
  text?: string;
  properties?: {
    full_address?: string;
    mapbox_id?: string;
  };
}

export function MapboxAutofill({ 
  value, 
  onChange, 
  onAddressSelected,
  placeholder, 
  label,
  icon: IconComponent,
  className = ''
}: MapboxAutofillProps) {
  console.log('🗺️ MapboxAutofill component mounted with props:', {
    value, placeholder, label, hasIcon: !!IconComponent, hasOnChange: !!onChange
  });
  
  const [selectedFromAutocomplete, setSelectedFromAutocomplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  // Debug state changes (can be removed in production)
  useEffect(() => {
    console.log('🔄 State update - suggestions:', suggestions.length, 'showSuggestions:', showSuggestions);
  }, [suggestions, showSuggestions]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Test Laravel API on component mount
  useEffect(() => {
    const testLaravelAPI = async () => {
      try {
        console.log('🧪 Testing Laravel Mapbox API endpoint...');
        const testUrl = `/api/mapbox/suggest?q=new%20york&limit=1`;
        
        console.log('🌐 API URL:', testUrl);
        
        const response = await fetch(testUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
          },
        });
        console.log('🧪 Laravel API status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Laravel API working:', data);
        } else {
          const errorText = await response.text();
          console.error('❌ Laravel API failed:', response.status, errorText);
        }
      } catch (error) {
        console.error('❌ Laravel API test error:', error);
      }
    };
    
    testLaravelAPI();
  }, []);

  // Fetch suggestions from Laravel API
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const url = `/api/mapbox/suggest?q=${encodeURIComponent(query)}&types=address&country=US&limit=5`;
      
      console.log('🔍 Fetching suggestions from:', url);
      
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
      console.log('💡 Received suggestions:', data);
      
      // Handle both direct API response and Laravel wrapped response
      let suggestions: MapboxSuggestion[] = [];
      if (data.suggestions && Array.isArray(data.suggestions)) {
        suggestions = data.suggestions;
      } else if (data.features && Array.isArray(data.features)) {
        // Direct Mapbox API response format
        suggestions = data.features;
      } else if (Array.isArray(data)) {
        // Simple array format
        suggestions = data;
      }
      
      console.log('✅ Loaded', suggestions.length, 'suggestions');
      
      setSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('📝 Input changed:', newValue);
    
    setSelectedFromAutocomplete(false);
    setActiveSuggestion(-1);
    onChange(newValue);
    
    // Start debounced search
    debouncedSearch(newValue);
  };

  const parseAddressComponents = (suggestion: MapboxSuggestion) => {
    // Extract address from Mapbox Geocoding API response format
    const fullAddress = suggestion.full_address ||
                       suggestion.place_formatted ||
                       suggestion.address ||
                       suggestion.name ||
                       suggestion.place_name ||
                       suggestion.properties?.full_address ||
                       suggestion.text || '';

    // Try to parse city, state, zip from the full address
    // Mapbox place_name format is typically: "123 Main St, City, State ZIP, Country"
    let city = '';
    let state = '';
    let zip = '';
    
    if (fullAddress) {
      const parts = fullAddress.split(',').map(part => part.trim());
      
      // Look for ZIP code pattern in the last few parts
      const zipRegex = /\b\d{5}(?:-\d{4})?\b/;
      let zipMatch = null;
      
      for (let i = parts.length - 1; i >= 0; i--) {
        const match = parts[i].match(zipRegex);
        if (match) {
          zipMatch = match[0];
          // Remove ZIP from this part to get state
          state = parts[i].replace(zipMatch, '').trim();
          // City is typically the part before state
          if (i > 0) {
            city = parts[i - 1];
          }
          break;
        }
      }
      
      // Fallback: try to identify city as second-to-last component if no ZIP found
      if (!city && parts.length >= 3) {
        city = parts[parts.length - 3] || '';
        state = parts[parts.length - 2] || '';
      }
      
      zip = zipMatch || '';
    }

    return {
      address: fullAddress,
      city: city,
      state: state,
      zip: zip,
      coordinates: suggestion.coordinates ? {
        longitude: suggestion.coordinates[0],
        latitude: suggestion.coordinates[1]
      } : undefined
    };
  };

  const handleSuggestionSelect = (suggestion: MapboxSuggestion) => {
    console.log('🎯 Suggestion selected:', suggestion);
    
    const addressData = parseAddressComponents(suggestion);
    
    if (addressData.address) {
      console.log('✅ Setting address from suggestion:', addressData);
      setSelectedFromAutocomplete(true);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
      onChange(addressData.address);
      
      // Notify parent component with parsed address data
      if (onAddressSelected) {
        onAddressSelected(addressData);
      }
    } else {
      console.warn('⚠️ No address found in suggestion:', suggestion);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!showSuggestions && suggestions.length > 0) {
          setShowSuggestions(true);
          setActiveSuggestion(0);
        } else if (showSuggestions && suggestions.length > 0) {
          setActiveSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          setActiveSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        }
        break;
        
      case 'Enter':
        if (showSuggestions && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          e.preventDefault();
          handleSuggestionSelect(suggestions[activeSuggestion]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
        break;
        
      case 'Tab':
        if (showSuggestions) {
          setShowSuggestions(false);
          setActiveSuggestion(-1);
        }
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    console.log('🎯 Input focused');
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Use a longer delay to ensure clicks on suggestions work
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    }, 200);
  };

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeSuggestion >= 0 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.querySelector(`#suggestion-${activeSuggestion}`);
      if (activeElement) {
        activeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [activeSuggestion]);

  // Handle manual address confirmation when user types without selecting
  const checkForManualAddress = () => {
    if (value && !selectedFromAutocomplete && value.trim().length > 10) {
      setManualAddress(value);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmAddress = () => {
    setSelectedFromAutocomplete(true);
    setShowConfirmDialog(false);
    onChange(manualAddress);
  };

  const handleCancelAddress = () => {
    setShowConfirmDialog(false);
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      
      <div className="relative">
        {/* Main input container */}
        <div className="relative group">
          {IconComponent && (
            <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-form-type="other"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
            className={`
              w-full ${IconComponent ? 'pl-12' : 'pl-4'} pr-12 py-3 border rounded-xl text-sm
              transition-all duration-200 placeholder:text-muted-foreground/60
              border-border hover:border-border/80 focus:border-primary 
              focus:ring-4 focus:ring-primary/10 focus:outline-none 
              bg-background/50 hover:bg-background
            `}
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
          )}
          
          {/* Success checkmark */}
          {selectedFromAutocomplete && value && !isLoading && (
            <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
          )}
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="
              absolute top-full left-0 right-0 mt-1 bg-background border border-border 
              rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto
            "
            role="listbox"
          >
            {suggestions.map((suggestion, index) => {
              // Extract address from Mapbox Search Box API response format
              const address = suggestion.full_address ||
                             suggestion.place_formatted ||
                             suggestion.address ||
                             suggestion.name ||
                             suggestion.place_name ||
                             suggestion.properties?.full_address ||
                             suggestion.text ||
                             'Unknown address';
              
              const suggestionId = suggestion.mapbox_id || 
                                 suggestion.id || 
                                 suggestion.properties?.mapbox_id ||
                                 index.toString();
              
              const isActive = index === activeSuggestion;
              
              return (
                <button
                  key={suggestionId}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors
                    border-b border-border/30 last:border-b-0 text-sm
                    ${isActive ? 'bg-muted/50' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{address}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Address Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 shadow-2xl max-w-md mx-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Address is different from what we found
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We couldn't find this exact address in our suggestions. Is this address correct?
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">
                      {manualAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelAddress}
                className="flex-1 py-2.5 px-4 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                Let me fix it
              </button>
              <button
                onClick={handleConfirmAddress}
                className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Confirm address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}