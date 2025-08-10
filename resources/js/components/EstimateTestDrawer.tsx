import { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, ArrowRight, CheckCircle, DollarSign, FileText, Loader2, MapPin, Package, Clock, Calendar, ChevronDown, ChevronUp, Users, Truck, Receipt, TrendingUp, Percent, Navigation, Home, Palette, Phone, Mail, Shield, Boxes, CreditCard } from 'lucide-react';
import { getIcon } from '@/lib/remix-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parseDate } from 'chrono-node';
import { MapboxAutofill } from '@/components/ui/MapboxAutofill';
import { RouteCalculation } from '@/components/ui/RouteCalculation';

interface EstimateTestDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    widget: {
        id: number;
        name: string;
        widget_key?: string;
        enabled_modules: string[];
        module_configs: Record<string, any>;
        pricing?: Record<string, any>;
    };
    fullScreen?: boolean;
}

interface WidgetConfig {
    widget_id: string;
    steps_data: Record<string, {
        id: string;
        title: string;
        subtitle?: string;
        prompt: {
            message: string;
            type: string;
        };
        options: Array<{
            id: string;
            value: string;
            title: string;
            description?: string;
            icon?: string;
            type?: string;
        }>;
        buttons: {
            primary: { text: string; action: string };
            secondary?: { text: string; action: string };
        };
        layout: {
            type: string;
            columns?: number;
            centered?: boolean;
        };
        validation: {
            required: boolean;
            field: string;
        };
    }>;
    step_order: string[];
    branding: Record<string, any>;
    pricing: Record<string, any>;
}

interface EstimateResponse {
    widget_id: number;
    widget_name: string;
    total_price: number;
    base_price: number;
    breakdown: Array<{
        item: string;
        description: string;
        price: number;
        type: string;
    }>;
    currency: string;
}

function CalendarInput({ stepId, currentResponse, onResponse }: { 
    stepId: string; 
    currentResponse: any; 
    onResponse: (stepId: string, response: any) => void; 
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(currentResponse?.inputValue || "Tomorrow");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        currentResponse?.selectedDate ? new Date(currentResponse.selectedDate) : 
        parseDate(inputValue) || undefined
    );
    const [month, setMonth] = useState<Date | undefined>(selectedDate || new Date());

    const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long", 
            year: "numeric",
        });
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        const parsedDate = parseDate(value);
        if (parsedDate) {
            setSelectedDate(parsedDate);
            setMonth(parsedDate);
            const isoString = parsedDate.toISOString().split('T')[0];
            onResponse(stepId, { selectedDate: isoString, inputValue: value });
        } else {
            onResponse(stepId, { inputValue: value });
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            const formatted = formatDate(date);
            setInputValue(formatted);
            const isoString = date.toISOString().split('T')[0];
            onResponse(stepId, { selectedDate: isoString, inputValue: formatted });
            setOpen(false);
        }
    };

    return (
        <Card className="p-6 bg-white border shadow-sm">
            <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="moving-date" className="text-sm font-medium">
                    Moving Date
                </Label>
                <div className="relative flex gap-2">
                    <Input
                        id="moving-date"
                        value={inputValue}
                        placeholder="Tomorrow, next week, or a specific date"
                        className="bg-background pr-10 w-full"
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setOpen(true);
                            }
                        }}
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="date-picker"
                                variant="ghost"
                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            >
                                <Calendar className="size-3.5" />
                                <span className="sr-only">Select date</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                            <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                captionLayout="dropdown"
                                month={month}
                                onMonthChange={setMonth}
                                onSelect={handleCalendarSelect}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                }}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                {selectedDate && (
                    <div className="text-muted-foreground text-sm">
                        Moving date set for{" "}
                        <span className="font-medium text-foreground">{formatDate(selectedDate)}</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

export default function EstimateTestDrawer({ isOpen, onClose, widget, fullScreen = false }: EstimateTestDrawerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [widgetConfig, setWidgetConfig] = useState<WidgetConfig | null>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);
    const [routeData, setRouteData] = useState<any>(null);
    const [showResumeOption, setShowResumeOption] = useState(false);
    const [savedProgress, setSavedProgress] = useState<any>(null);
    const [expandedSections, setExpandedSections] = useState({
        breakdown: true,
        services: false,
        moveDetails: false
    });
    
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section as keyof typeof prev]
        }));
    };
    
    // LocalStorage utilities
    const getStorageKey = () => `estimate_progress_widget_${widget.id}`;
    
    const saveProgressToStorage = (step: number, responses: Record<string, any>) => {
        try {
            const progress = {
                widgetId: widget.id,
                widgetName: widget.name,
                currentStep: step,
                responses: responses,
                timestamp: new Date().toISOString(),
                version: '1.0' // For future compatibility
            };
            localStorage.setItem(getStorageKey(), JSON.stringify(progress));
            console.log('✅ Progress saved to localStorage:', progress);
        } catch (error) {
            console.warn('⚠️ Failed to save progress to localStorage:', error);
        }
    };
    
    const loadProgressFromStorage = () => {
        // Don't load saved progress in full-screen mode (public preview)
        if (fullScreen) {
            return null;
        }
        
        try {
            const stored = localStorage.getItem(getStorageKey());
            if (stored) {
                const progress = JSON.parse(stored);
                console.log('📂 Loaded progress from localStorage:', progress);
                
                // Check if the saved progress is recent (within 30 days)
                const saveDate = new Date(progress.timestamp);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                if (saveDate > thirtyDaysAgo && progress.widgetId === widget.id) {
                    return progress;
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load progress from localStorage:', error);
        }
        return null;
    };
    
    const clearProgressFromStorage = () => {
        try {
            localStorage.removeItem(getStorageKey());
            console.log('🗑️ Progress cleared from localStorage');
        } catch (error) {
            console.warn('⚠️ Failed to clear progress from localStorage:', error);
        }
    };
    
    // Load widget configuration when drawer opens
    useEffect(() => {
        if (isOpen) {
            // Check for saved progress
            const saved = loadProgressFromStorage();
            if (saved && saved.responses && Object.keys(saved.responses).length > 0) {
                setSavedProgress(saved);
                setShowResumeOption(true);
            } else {
                startFreshSession();
            }
            loadWidgetConfig();
        }
    }, [isOpen, widget.id]);
    
    const startFreshSession = () => {
        setCurrentStep(0);
        setResponses({});
        setEstimate(null);
        setError(null);
        setWidgetConfig(null);
        setRouteData(null);
        setShowResumeOption(false);
        setSavedProgress(null);
        // Clear any old progress
        clearProgressFromStorage();
    };
    
    const resumeSavedSession = () => {
        if (savedProgress) {
            setCurrentStep(savedProgress.currentStep);
            setResponses(savedProgress.responses);
            setShowResumeOption(false);
            console.log('🔄 Resumed session from step:', savedProgress.currentStep);
        }
    };

    const loadWidgetConfig = async () => {
        setIsLoadingConfig(true);
        setError(null);

        try {
            // Use public API for full-screen mode, protected API for drawer mode
            const apiUrl = fullScreen 
                ? `/api/widget/${widget.widget_key}/config`
                : `/api/user/widgets/${widget.id}/config`;
                
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`Failed to load widget configuration: ${response.status} ${response.statusText}`);
            }

            const config = await response.json();
            setWidgetConfig(config);
            console.log('Widget config loaded:', config);
        } catch (err) {
            console.error('Full error:', err);
            if (err instanceof Error && err.message.includes('Unexpected token')) {
                setError('Authentication error - please refresh the page and try again');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load configuration');
            }
        } finally {
            setIsLoadingConfig(false);
        }
    };

    const stepOrder = widgetConfig?.step_order || [];
    const currentStepId = stepOrder[currentStep];
    const currentStepConfig = currentStepId ? widgetConfig?.steps_data[currentStepId] : null;
    const isLastStep = currentStep >= stepOrder.length - 1;

    // No longer need auto-trigger useEffect since RouteCalculation component handles this directly
    
    const canProceed = () => {
        console.log('canProceed called:', { currentStepId, currentStepConfig, responses });
        
        if (!currentStepId || !currentStepConfig) {
            console.log('No current step, returning true');
            return true;
        }

        const response = responses[currentStepId];
        console.log('Current step response:', response);
        console.log('Step title:', currentStepConfig.title);
        
        // If step is not required, allow proceeding even without response
        if (!currentStepConfig.validation?.required) {
            console.log('Step not required, returning true');
            return true;
        }

        if (!response) {
            console.log('No response found for required step, returning false');
            return false;
        }
        
        // Check based on layout/prompt type
        const layoutType = currentStepConfig.layout?.type;
        const promptType = currentStepConfig.prompt?.type;
        
        let canProceedResult = false;
        
        // Check for contact info step first (before other conditions)
        if (currentStepId === 'contact-info' || currentStepId.includes('contact') || currentStepConfig.title?.toLowerCase().includes('contact')) {
            // Contact info - require first name, email, and phone
            console.log('Processing contact info validation:', { 
                first_name: response?.first_name, 
                email: response?.email, 
                phone: response?.phone 
            });
            canProceedResult = !!(response.first_name && response.first_name.trim() && 
                                response.email && response.email.trim() && 
                                response.phone && response.phone.trim());
            console.log('Contact info validation result:', canProceedResult);
        } else if (layoutType === 'form' || promptType === 'address') {
            // Form fields need specific validation
            if (currentStepId.includes('location')) {
                // Address fields - require at least address
                canProceedResult = !!(response.address && response.address.trim());
            } else {
                // Other form fields - require any non-empty value
                canProceedResult = Object.values(response).some(value => value && value.toString().trim() !== '');
            }
        } else if (layoutType === 'list' && currentStepConfig.layout?.selectable === 'multiple') {
            // Multiple selection
            canProceedResult = Array.isArray(response.selections) && response.selections.length > 0;
        } else if (layoutType === 'calendar' || promptType === 'calendar') {
            // Calendar/date selection
            canProceedResult = !!response.selectedDate;
        } else if (promptType === 'route-calculation' || currentStepId.includes('route') || currentStepConfig.title?.toLowerCase().includes('route')) {
            // Route calculation step - can proceed if route has been calculated
            canProceedResult = !!(response.distance || response.routeData);
        } else if (promptType === 'moving-supplies' || currentStepId.includes('moving-supplies') || currentStepId.includes('supplies')) {
            // Moving supplies step - can proceed if they answered the supplies question
            canProceedResult = !!(response.needsSupplies !== undefined || response.customerProvidesOwn || (response.selectedSupplies && response.selectedSupplies.length > 0));
        } else if (currentStepId.includes('review') || currentStepConfig.title?.toLowerCase().includes('review') || currentStepConfig.title?.toLowerCase().includes('quote')) {
            // Review step - can proceed if review is confirmed
            canProceedResult = !!response.reviewConfirmed;
        } else {
            // Single selection or simple value
            canProceedResult = !!response.selectedOption || !!response.value;
        }
        
        console.log('Final canProceed result:', canProceedResult, 'layoutType:', layoutType, 'promptType:', promptType);
        return canProceedResult;
    };

    const handleNext = () => {
        if (isLastStep) {
            calculateEstimate();
        } else {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            // Save progress when moving to next step
            if (!showResumeOption && !estimate) {
                saveProgressToStorage(nextStep, responses);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleResponse = (stepId: string, value: any) => {
        console.log('handleResponse called:', { stepId, value });
        setResponses(prev => {
            const newResponses = {
                ...prev,
                [stepId]: value
            };
            console.log('Updated responses:', newResponses);
            
            // Auto-save progress to localStorage (debounced)
            if (!showResumeOption && !estimate) {
                setTimeout(() => {
                    saveProgressToStorage(currentStep, newResponses);
                }, 500); // 500ms debounce
            }
            
            return newResponses;
        });
    };

    const checkIfBothAddressesComplete = () => {
        // Look for pickup and destination addresses
        let pickupAddress = '';
        let destinationAddress = '';
        
        Object.keys(responses).forEach(stepId => {
            const response = responses[stepId];
            if (response?.address) {
                if (stepId.includes('pickup') || stepId.includes('origin')) {
                    pickupAddress = response.address;
                } else if (stepId.includes('destination') || stepId.includes('target')) {
                    destinationAddress = response.address;
                }
            }
        });
        
        return { pickupAddress, destinationAddress, bothComplete: !!(pickupAddress && destinationAddress) };
    };



    const calculateEstimate = async () => {
        setIsCalculating(true);
        setError(null);

        try {
            const response = await fetch(`/api/user/widgets/${widget.id}/estimate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({ responses }),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate estimate');
            }

            const data = await response.json();
            setEstimate(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsCalculating(false);
        }
    };

    const renderStep = (stepConfig: WidgetConfig['steps_data'][string], stepId: string) => {
        const currentResponse = responses[stepId];
        const { title, subtitle, prompt, options, layout } = stepConfig;
        
        console.log('renderStep called:', { stepId, stepConfig, currentResponse });
        console.log('Step prompt type:', prompt?.type, 'Step layout type:', layout?.type);

        return (
            <div className="space-y-6">
                {/* Step Header */}
                <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    {subtitle && (
                        <p className="text-muted-foreground mb-4">{subtitle}</p>
                    )}
                    {prompt.message && prompt.message !== title && (
                        <p className="text-muted-foreground">{prompt.message}</p>
                    )}
                </div>

                {/* Dynamic Content Based on Layout Type */}
                {stepId.includes('review') || title.toLowerCase().includes('review') || title.toLowerCase().includes('quote') ? (
                    renderReviewStep(stepId, currentResponse)
                ) : prompt.type === 'route-calculation' || stepId.includes('route') || title.toLowerCase().includes('route') ? (
                    renderRouteCalculation(stepId, currentResponse)
                ) : prompt.type === 'moving-supplies' || stepId.includes('moving-supplies') || stepId.includes('supplies') || title.toLowerCase().includes('supplies') ? (
                    renderMovingSupplies(stepId, currentResponse, stepConfig)
                ) : stepId === 'contact-info' || stepId.includes('contact') || title.toLowerCase().includes('contact') ? (
                    renderFormFields(options, stepId, currentResponse)
                ) : layout.type === 'form' || prompt.type === 'address' ? (
                    renderFormFields(options, stepId, currentResponse)
                ) : (layout.type === 'list' || layout.type === 'challenges') && layout.selectable === 'multiple' ? (
                    renderMultipleSelection(options, stepId, currentResponse)
                ) : layout.type === 'calendar' || prompt.type === 'calendar' ? (
                    renderCalendar(stepId, currentResponse)
                ) : (
                    renderSingleSelection(options, stepId, currentResponse)
                )}
            </div>
        );
    };

    const renderSingleSelection = (options: any[], stepId: string, currentResponse: any) => {
        const selectedOption = currentResponse?.selectedOption;
        
        return (
            <div className="space-y-3">
                {options.map((option, index) => {
                    const isSelected = selectedOption === option.id;
                    const IconComponent = getIcon(option.icon);
                    
                    return (
                        <Card
                            key={option.id || index}
                            className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                                isSelected 
                                    ? 'border-primary bg-primary/5 shadow-sm' 
                                    : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => {
                                handleResponse(stepId, { selectedOption: option.id });
                                // Auto-advance to next step after selection
                                if (!isLastStep) {
                                    setTimeout(() => {
                                        handleNext();
                                    }, 300); // Small delay to show selection feedback
                                }
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isSelected 
                                        ? 'border-primary bg-primary' 
                                        : 'border-muted-foreground'
                                }`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                {IconComponent && (
                                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base">{option.title || option.value}</h4>
                                    {option.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderMultipleSelection = (options: any[], stepId: string, currentResponse: any) => {
        const selections = currentResponse?.selections || [];
        
        return (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                {options.map((option, index) => {
                    const isSelected = selections.includes(option.id);
                    const IconComponent = getIcon(option.icon);
                    
                    return (
                        <Card
                            key={option.id || index}
                            className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                                isSelected 
                                    ? 'border-primary bg-primary/5 shadow-sm' 
                                    : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => {
                                const updatedSelections = isSelected
                                    ? selections.filter((s: string) => s !== option.id)
                                    : [...selections, option.id];
                                handleResponse(stepId, { selections: updatedSelections });
                            }}
                        >
                            <div className="flex items-center space-x-3">
                                <Checkbox checked={isSelected} onChange={() => {}} className="pointer-events-none" />
                                {IconComponent && (
                                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base">{option.title || option.value}</h4>
                                    {option.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const renderFormFields = (options: any[], stepId: string, currentResponse: any) => {
        // Handle address inputs (like origin-location, target-location)
        if (!options || options.length === 0) {
            const isAddressField = stepId.includes('location');
            
            if (isAddressField) {
                const isPickupLocation = stepId.includes('pickup') || stepId.includes('origin');
                const isDestinationLocation = stepId.includes('destination') || stepId.includes('target');
                
                let label = 'Address *';
                let placeholder = 'Enter full address...';
                
                if (isPickupLocation) {
                    label = 'Pickup Address *';
                    placeholder = 'Enter pickup address...';
                } else if (isDestinationLocation) {
                    label = 'Destination Address *';
                    placeholder = 'Enter destination address...';
                }
                
                return (
                    <Card className="p-6 bg-white border shadow-sm">
                        <div className="space-y-4">
                            <MapboxAutofill
                                label={label}
                                placeholder={placeholder}
                                value={currentResponse?.address || ''}
                                onChange={(address) => {
                                    handleResponse(stepId, { 
                                        ...currentResponse,
                                        address: address 
                                    });
                                }}
                                onAddressSelected={(addressData) => {
                                    handleResponse(stepId, { 
                                        ...currentResponse,
                                        address: addressData.address,
                                        city: addressData.city,
                                        zip: addressData.zip,
                                        state: addressData.state,
                                        coordinates: addressData.coordinates
                                    });
                                }}
                                icon={MapPin}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="City"
                                        value={currentResponse?.city || ''}
                                        onChange={(e) => handleResponse(stepId, { 
                                            ...currentResponse,
                                            city: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input
                                        id="zip"
                                        placeholder="ZIP"
                                        value={currentResponse?.zip || ''}
                                        onChange={(e) => handleResponse(stepId, { 
                                            ...currentResponse,
                                            zip: e.target.value 
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            } else if (stepId === 'contact-info') {
                return (
                    <div className="space-y-6">

                        {/* Contact Form */}
                        <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-border/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name" className="text-sm font-medium">First Name *</Label>
                                    <Input
                                        id="first_name"
                                        placeholder="John"
                                        value={currentResponse?.first_name || ''}
                                        onChange={(e) => handleResponse(stepId, { 
                                            ...currentResponse, 
                                            first_name: e.target.value 
                                        })}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        placeholder="Doe"
                                        value={currentResponse?.last_name || ''}
                                        onChange={(e) => handleResponse(stepId, { 
                                            ...currentResponse, 
                                            last_name: e.target.value 
                                        })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={currentResponse?.email || ''}
                                    onChange={(e) => handleResponse(stepId, { 
                                        ...currentResponse, 
                                        email: e.target.value 
                                    })}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your estimate will be sent to this email address
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    value={currentResponse?.phone || ''}
                                    onChange={(e) => handleResponse(stepId, { 
                                        ...currentResponse, 
                                        phone: e.target.value 
                                    })}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    We may call to confirm details or schedule your move
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preferred_contact" className="text-sm font-medium">Preferred Contact Method</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Card 
                                        className={`p-3 cursor-pointer border-2 transition-all hover:shadow-sm ${
                                            currentResponse?.preferred_contact === 'email' 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => handleResponse(stepId, { 
                                            ...currentResponse, 
                                            preferred_contact: 'email' 
                                        })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                currentResponse?.preferred_contact === 'email' 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-muted-foreground'
                                            }`}>
                                                {currentResponse?.preferred_contact === 'email' && 
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                }
                                            </div>
                                            <span className="text-sm font-medium">Email</span>
                                        </div>
                                    </Card>
                                    <Card 
                                        className={`p-3 cursor-pointer border-2 transition-all hover:shadow-sm ${
                                            currentResponse?.preferred_contact === 'phone' 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => handleResponse(stepId, { 
                                            ...currentResponse, 
                                            preferred_contact: 'phone' 
                                        })}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                currentResponse?.preferred_contact === 'phone' 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-muted-foreground'
                                            }`}>
                                                {currentResponse?.preferred_contact === 'phone' && 
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                }
                                            </div>
                                            <span className="text-sm font-medium">Phone</span>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="additional_notes" className="text-sm font-medium">Additional Notes (Optional)</Label>
                                <textarea
                                    id="additional_notes"
                                    placeholder="Any special requirements, questions, or details about your move..."
                                    value={currentResponse?.additional_notes || ''}
                                    onChange={(e) => handleResponse(stepId, { 
                                        ...currentResponse, 
                                        additional_notes: e.target.value 
                                    })}
                                    rows={3}
                                    className="w-full min-h-[80px] px-3 py-2 text-sm border border-border rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tell us anything else that would help us provide a better estimate
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
            
            return (
                <Input
                    placeholder="Enter your response"
                    value={currentResponse?.value || ''}
                    onChange={(e) => handleResponse(stepId, { value: e.target.value })}
                />
            );
        }

        return (
            <div className="space-y-4">
                {options.map((field, index) => (
                    <div key={field.id || index} className="space-y-2">
                        <Label htmlFor={field.id}>{field.title}{field.required && ' *'}</Label>
                        <Input
                            id={field.id}
                            type={field.type || 'text'}
                            placeholder={field.description || field.title}
                            value={currentResponse?.[field.id] || ''}
                            onChange={(e) => handleResponse(stepId, { 
                                ...currentResponse, 
                                [field.id]: e.target.value 
                            })}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const renderCalendar = (stepId: string, currentResponse: any) => {
        return <CalendarInput stepId={stepId} currentResponse={currentResponse} onResponse={handleResponse} />;
    };

    const renderMovingSupplies = (stepId: string, currentResponse: any, stepConfig: any) => {
        console.log('🚛 renderMovingSupplies called:', { stepId, stepConfig, currentResponse });
        
        const needsSupplies = currentResponse?.needsSupplies;
        const selectedSupplies = currentResponse?.selectedSupplies || {};
        const supplyOptions = stepConfig?.options || [];

        console.log('Supply options from config:', supplyOptions);
        console.log('Current response:', currentResponse);

        // Step 1: Ask if they need supplies
        const handleSuppliesDecision = (needsThem: boolean) => {
            handleResponse(stepId, {
                needsSupplies: needsThem,
                selectedSupplies: needsThem ? {} : {}, // Reset if they don't need supplies
            });
            
            // If they don't need supplies, automatically advance to next step
            if (!needsThem && !isLastStep) {
                setTimeout(() => {
                    handleNext();
                }, 100); // Small delay to ensure response is saved
            }
        };

        // Show the initial question if undefined or false (but with selection shown if false)
        console.log('🚛 needsSupplies value:', needsSupplies);
        if (needsSupplies === undefined || needsSupplies === false) {
            return (
                <div className="space-y-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Do you need moving supplies?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            We offer professional packing supplies to make your move easier and safer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Card 
                            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-md ${
                                needsSupplies === true 
                                    ? 'border-primary bg-primary/5 shadow-sm' 
                                    : 'hover:border-primary/50'
                            }`}
                            onClick={() => handleSuppliesDecision(true)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base text-foreground">Yes, I need supplies</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Browse our professional moving supplies with competitive pricing
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </Card>

                        <Card 
                            className={`p-6 cursor-pointer border-2 transition-all hover:shadow-md ${
                                needsSupplies === false 
                                    ? 'border-primary bg-primary/5 shadow-sm' 
                                    : 'hover:border-primary/50'
                            }`}
                            onClick={() => handleSuppliesDecision(false)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base text-foreground">No, I have my own supplies</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        I already have boxes, tape, and packing materials
                                    </p>
                                </div>
                                <div className="text-green-600 font-semibold">$0</div>
                            </div>
                        </Card>
                    </div>
                </div>
            );
        }


        // Step 2: Show categorized supplies (only if they need supplies)
        if (needsSupplies === true) {
            return renderSupplyCategoriesAndItems(stepId, currentResponse, supplyOptions);
        }
        
        // If needsSupplies is false, return null - auto-advance should handle it
        return null;
    };

    const renderSupplyCategoriesAndItems = (stepId: string, currentResponse: any, supplyOptions: any[]) => {
        const selectedSupplies = currentResponse?.selectedSupplies || {};

        // Parse supply options into categories
        const categorizedSupplies = supplyOptions.reduce((categories: any, supply: any) => {
            const category = supply.category || 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(supply);
            return categories;
        }, {});

        // Add default supplies if none configured
        if (Object.keys(categorizedSupplies).length === 0) {
            categorizedSupplies['Boxes'] = [
                { id: 'small-box', name: 'Small Boxes', price: 2.50, icon: 'box' },
                { id: 'medium-box', name: 'Medium Boxes', price: 3.75, icon: 'box' },
                { id: 'large-box', name: 'Large Boxes', price: 5.00, icon: 'box' },
                { id: 'wardrobe-box', name: 'Wardrobe Boxes', price: 12.00, icon: 'shirt' },
            ];
            categorizedSupplies['Packing Materials'] = [
                { id: 'bubble-wrap', name: 'Bubble Wrap Roll', price: 15.00, icon: 'layers' },
                { id: 'packing-tape', name: 'Packing Tape', price: 8.00, icon: 'package' },
                { id: 'packing-paper', name: 'Packing Paper', price: 12.00, icon: 'bookopen' },
            ];
        }

        const updateSupplyQuantity = (supplyId: string, quantity: number) => {
            const newSupplies = { ...selectedSupplies };
            if (quantity > 0) {
                newSupplies[supplyId] = quantity;
            } else {
                delete newSupplies[supplyId];
            }

            handleResponse(stepId, {
                ...currentResponse,
                selectedSupplies: newSupplies,
            });
        };

        const calculateTotal = () => {
            let total = 0;
            Object.keys(selectedSupplies).forEach(supplyId => {
                const quantity = selectedSupplies[supplyId];
                // Find the supply in any category
                let supplyPrice = 0;
                Object.values(categorizedSupplies).forEach((categoryItems: any) => {
                    const supply = categoryItems.find((item: any) => item.id === supplyId);
                    if (supply) supplyPrice = supply.price;
                });
                total += quantity * supplyPrice;
            });
            return total;
        };

        const totalItems = Object.values(selectedSupplies).reduce((sum: number, qty: any) => sum + qty, 0);
        const totalCost = calculateTotal();

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Select Your Supplies</h3>
                        <p className="text-sm text-muted-foreground">
                            Professional moving supplies delivered to your door
                        </p>
                    </div>
                    <Button
                        onClick={() => handleResponse(stepId, { needsSupplies: undefined })}
                        variant="outline"
                        size="sm"
                    >
                        ← Back
                    </Button>
                </div>

                <Tabs defaultValue={Object.keys(categorizedSupplies)[0]} className="w-full">
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Object.keys(categorizedSupplies).length}, minmax(0, 1fr))` }}>
                        {Object.keys(categorizedSupplies).map((categoryName) => (
                            <TabsTrigger key={categoryName} value={categoryName} className="capitalize">
                                {categoryName}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {Object.entries(categorizedSupplies).map(([categoryName, items]: [string, any]) => (
                        <TabsContent key={categoryName} value={categoryName} className="space-y-3 mt-6">
                            <div className="grid grid-cols-1 gap-3">
                                {items.map((supply: any) => {
                                    const currentQuantity = selectedSupplies[supply.id] || 0;
                                    const IconComponent = getIcon(supply.icon);

                                    return (
                                        <Card key={supply.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {IconComponent && (
                                                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                    <div>
                                                        <h5 className="font-medium text-foreground">{supply.name}</h5>
                                                        <p className="text-sm text-primary font-semibold">
                                                            ${supply.price.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateSupplyQuantity(supply.id, Math.max(0, currentQuantity - 1))}
                                                            disabled={currentQuantity <= 0}
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium">
                                                            {currentQuantity}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => updateSupplyQuantity(supply.id, currentQuantity + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* Total */}
                {totalItems > 0 && (
                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-foreground">Supplies Total</h4>
                                <p className="text-sm text-muted-foreground">
                                    {totalItems} item{totalItems !== 1 ? 's' : ''} selected
                                </p>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                ${totalCost.toFixed(2)}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        );
    };

    const renderReviewStep = (stepId: string, currentResponse: any) => {
        // Automatically mark this step as completed since it's just a review
        if (!currentResponse || !currentResponse.reviewConfirmed) {
            handleResponse(stepId, { reviewConfirmed: true });
        }

        // Collect all the data from responses for display
        const collectReviewData = () => {
            const reviewData: any = {
                service: '',
                serviceType: '',
                moveSize: '',
                moveDate: '',
                timeWindow: '',
                distance: null,
                pickupAddress: '',
                destinationAddress: '',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                supplies: false,
                suppliesCount: 0
            };

            Object.keys(responses).forEach(responseStepId => {
                const response = responses[responseStepId];
                if (!response) return;

                const stepConfig = widgetConfig?.steps_data[responseStepId];

                // Service information
                if (responseStepId.includes('service-selection') && response.selectedOption && stepConfig) {
                    const option = stepConfig.options?.find(opt => opt.id === response.selectedOption);
                    reviewData.service = option?.title || option?.value || response.selectedOption;
                }

                if (responseStepId.includes('service-type') && response.selectedOption && stepConfig) {
                    const option = stepConfig.options?.find(opt => opt.id === response.selectedOption);
                    reviewData.serviceType = option?.title || option?.value || response.selectedOption;
                }

                // Move details
                if ((responseStepId.includes('size') || responseStepId.includes('bedroom') || responseStepId.includes('scope')) && response.selectedOption && stepConfig) {
                    const option = stepConfig.options?.find(opt => opt.id === response.selectedOption);
                    reviewData.moveSize = option?.title || option?.value || response.selectedOption;
                }

                if (response.selectedDate) {
                    reviewData.moveDate = response.selectedDate;
                }

                if (responseStepId.includes('time') && response.selectedOption && stepConfig) {
                    const option = stepConfig.options?.find(opt => opt.id === response.selectedOption);
                    reviewData.timeWindow = option?.title || option?.value || response.selectedOption;
                }

                // Location information
                if (response.address) {
                    if (responseStepId.includes('pickup') || responseStepId.includes('origin')) {
                        reviewData.pickupAddress = response.address;
                    } else if (responseStepId.includes('destination') || responseStepId.includes('target')) {
                        reviewData.destinationAddress = response.address;
                    }
                }

                // Route information
                if (response.distance || response.routeData) {
                    reviewData.distance = response.distance;
                }

                // Contact information
                if (responseStepId === 'contact-info' || responseStepId.includes('contact')) {
                    reviewData.contactName = `${response.first_name || ''} ${response.last_name || ''}`.trim();
                    reviewData.contactEmail = response.email || '';
                    reviewData.contactPhone = response.phone || '';
                }

                // Supplies information
                if (responseStepId.includes('supplies')) {
                    reviewData.supplies = response.needsSupplies === true;
                    if (response.selectedSupplies) {
                        reviewData.suppliesCount = Object.keys(response.selectedSupplies).length;
                    }
                }
            });

            return reviewData;
        };

        const reviewData = collectReviewData();

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Review Your Moving Quote</h2>
                    <p className="text-sm text-muted-foreground">
                        Here's your personalized estimate based on your selections
                    </p>
                </div>

                {/* Compact Review Cards */}
                <div className="grid gap-4">
                    {/* Service Details */}
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Truck className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Service Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {reviewData.service && (
                                <>
                                    <span className="text-muted-foreground">How Can We Help?</span>
                                    <span className="font-medium text-foreground">{reviewData.service}</span>
                                </>
                            )}
                            {reviewData.serviceType && (
                                <>
                                    <span className="text-muted-foreground">What Do You Need Help With?</span>
                                    <span className="font-medium text-foreground">{reviewData.serviceType}</span>
                                </>
                            )}
                            {reviewData.moveSize && (
                                <>
                                    <span className="text-muted-foreground">Move Size</span>
                                    <span className="font-medium text-foreground">{reviewData.moveSize}</span>
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Move Details */}
                    <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Move Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            {reviewData.moveDate && (
                                <>
                                    <span className="text-muted-foreground">Move Date</span>
                                    <span className="font-medium text-foreground">
                                        {new Date(reviewData.moveDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </>
                            )}
                            {reviewData.timeWindow && (
                                <>
                                    <span className="text-muted-foreground">Time Window</span>
                                    <span className="font-medium text-foreground">
                                        {reviewData.timeWindow === 'morning' ? 'Morning' :
                                         reviewData.timeWindow === 'afternoon' ? 'Afternoon' :
                                         reviewData.timeWindow}
                                    </span>
                                </>
                            )}
                            {reviewData.distance && (
                                <>
                                    <span className="text-muted-foreground">Distance</span>
                                    <span className="font-medium text-foreground">{reviewData.distance.toFixed(1)} miles</span>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Ready to Calculate */}
                <Card className="p-4 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                        Please review your information before we calculate your personalized estimate
                    </p>
                </Card>
            </div>
        );
    };

    const renderRouteCalculation = (stepId: string, currentResponse: any) => {
        const { pickupAddress, destinationAddress, bothComplete } = checkIfBothAddressesComplete();
        
        // If route calculation is already done, show the results
        if (currentResponse?.distance) {
            return (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Route Calculated</h2>
                        <p className="text-lg font-medium text-primary">
                            Distance: {currentResponse.distance.toFixed(1)} miles
                        </p>
                    </div>

                    {/* Address Card */}
                    <Card className="p-5 bg-white border shadow-sm">
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
                            
                            <Separator />
                            
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
                    </Card>

                    {/* Action */}
                    <div className="text-center">
                        <Button
                            onClick={() => {
                                // Clear the route data to recalculate
                                handleResponse(stepId, {});
                                setRouteData(null);
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Recalculate Route
                        </Button>
                    </div>
                </div>
            );
        }
        
        if (!bothComplete) {
            return (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <MapPin className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Missing Address Information</h3>
                        <p className="text-muted-foreground mb-4">
                            Please go back and complete both pickup and destination address fields.
                        </p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${pickupAddress ? 'bg-green-500' : 'bg-red-300'}`} />
                            <span>Pickup Address {pickupAddress ? '✓' : '❌'}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${destinationAddress ? 'bg-green-500' : 'bg-red-300'}`} />
                            <span>Destination Address {destinationAddress ? '✓' : '❌'}</span>
                        </div>
                    </div>
                </div>
            );
        }
        
        // If addresses are complete, show the RouteCalculation component directly in the drawer
        return (
            <RouteCalculation
                pickupAddress={pickupAddress}
                destinationAddress={destinationAddress}
                onComplete={(data) => {
                    console.log('Route calculation completed:', data);
                    setRouteData(data);
                    
                    // Store route data in responses for estimate calculation
                    handleResponse(stepId, {
                        distance: data.routeDistance,
                        duration: data.routeDuration,
                        routeData: data.routeData
                    });
                    
                    // Automatically advance to the next step after route calculation
                    if (!isLastStep) {
                        handleNext();
                    }
                }}
            />
        );
    };


    const renderEstimateResults = () => {
        if (!estimate) return null;

        // Extract move details from responses
        const getMoveDetails = () => {
            const details: any = {};
            Object.keys(responses).forEach(stepId => {
                const response = responses[stepId];
                if (response) {
                    // Date information
                    if (response.selectedDate) {
                        details.moveDate = new Date(response.selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        });
                    }
                    
                    // Time information
                    if (response.selectedOption && (stepId.includes('time') || stepId.includes('window'))) {
                        details.timeWindow = response.selectedOption;
                    }
                    
                    // Address information
                    if (response.address) {
                        if (stepId.includes('pickup') || stepId.includes('origin')) {
                            details.pickupAddress = response;
                        } else if (stepId.includes('destination') || stepId.includes('target')) {
                            details.destinationAddress = response;
                        }
                    }
                    
                    // Service type
                    if (response.selectedOption && stepId.includes('service')) {
                        details.serviceType = response.selectedOption;
                    }
                    
                    // Move size
                    if (response.selectedOption && (stepId.includes('size') || stepId.includes('bedroom') || stepId.includes('scope'))) {
                        details.moveSize = response.selectedOption;
                    }
                    
                    // Distance info from distance-calculation step
                    if (stepId === 'distance-calculation' && response.distance) {
                        details.distance = response.distance;
                        details.duration = response.duration;
                    }
                    
                    // Also check for direct distance property
                    if (response.distance) {
                        details.distance = response.distance;
                        details.duration = response.duration;
                    }
                }
            });
            return details;
        };

        const moveDetails = getMoveDetails();
        
        // Calculate estimated duration based on total price (rough estimate)
        const estimatedHours = Math.max(2, Math.round(estimate.total_price / 200));

        // Categorize breakdown items more precisely
        const baseItems = estimate.breakdown.filter((item: any) => item.type === 'base');
        const adjustments = estimate.breakdown.filter((item: any) => item.type === 'adjustment');
        const challenges = estimate.breakdown.filter((item: any) => item.type === 'challenge' || item.type === 'discount');
        const travel = estimate.breakdown.filter((item: any) => item.type === 'travel');
        const additionalServices = estimate.breakdown.filter((item: any) => item.type === 'additional');
        const supplies = estimate.breakdown.filter((item: any) => item.type === 'supply' || item.type === 'supplies');
        const taxes = estimate.breakdown.filter((item: any) => item.type === 'tax');
        
        const subtotal = estimate.breakdown
            .filter((item: any) => item.type !== 'tax')
            .reduce((sum: number, item: any) => sum + item.price, 0);
        const taxTotal = taxes.reduce((sum: number, item: any) => sum + item.price, 0);

        // Get contact info
        const contactInfo = responses['contact-info'] || {};

        return (
            <div className="space-y-8">

                {/* Total Price Hero Card */}
                <Card className="p-6 bg-white border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Estimate</p>
                            <h2 className="text-3xl font-bold text-primary">${estimate.total_price.toLocaleString()}</h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {moveDetails.distance && (
                            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Navigation className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Travel Distance</p>
                                    <p className="font-semibold text-sm">{moveDetails.distance.toFixed(1)} miles</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Home className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Move Size</p>
                                <p className="font-semibold text-sm">
                                    {(() => {
                                        // Get the actual option title from widget config
                                        const projectScopeStep = widgetConfig?.steps_data['project-scope'];
                                        const selectedOptionId = responses['project-scope']?.selectedOption;
                                        if (projectScopeStep && selectedOptionId) {
                                            const option = projectScopeStep.options?.find(opt => opt.id === selectedOptionId);
                                            if (option) return option.title || option.value;
                                        }
                                        return moveDetails.moveSize ? moveDetails.moveSize.replace('_', ' ').replace('-', ' ') : 'Standard Move';
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Detailed Cost Breakdown */}
                <Card className="">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">Cost Breakdown</h3>
                                <p className="text-sm text-muted-foreground">Detailed itemization of all charges</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%]">Service</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Base Services */}
                                {baseItems.length > 0 && (
                                    <>
                                        {baseItems.map((item: any, index: number) => (
                                            <TableRow key={`base-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        Base Service
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold px-2">${item.price.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                        {baseItems.length > 1 && (
                                            <TableRow className="bg-blue-50/30">
                                                <TableCell colSpan={2} className="font-medium text-blue-800 px-2">
                                                    Base Services Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-blue-800">
                                                    ${baseItems.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                
                                {/* Service Adjustments */}
                                {adjustments.length > 0 && (
                                    <>
                                        {adjustments.map((item: any, index: number) => (
                                            <TableRow key={`adjustment-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        Adjustment
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-purple-700">
                                                    {item.price >= 0 ? '+' : ''}${item.price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {adjustments.length > 1 && (
                                            <TableRow className="bg-purple-50/30">
                                                <TableCell colSpan={2} className="font-medium text-purple-800 px-2">
                                                    Service Adjustments Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-purple-800">
                                                    {adjustments.reduce((sum: number, item: any) => sum + item.price, 0) >= 0 ? '+' : ''}
                                                    ${adjustments.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                
                                {/* Challenges & Complications */}
                                {challenges.length > 0 && (
                                    <>
                                        {challenges.map((item: any, index: number) => (
                                            <TableRow key={`challenge-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className={item.type === 'discount' 
                                                        ? "bg-green-50 text-green-700 border-green-200" 
                                                        : "bg-orange-50 text-orange-700 border-orange-200"}>
                                                        {item.type === 'discount' ? 'Discount' : 'Challenge'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className={`text-right font-semibold ${
                                                    item.type === 'discount' ? 'text-green-700' : 'text-orange-700'
                                                }`}>
                                                    {item.price >= 0 ? '+' : ''}${item.price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {challenges.length > 1 && (
                                            <TableRow className="bg-orange-50/30">
                                                <TableCell colSpan={2} className="font-medium text-orange-800 px-2">
                                                    Challenges & Complications Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-orange-800">
                                                    {challenges.reduce((sum: number, item: any) => sum + item.price, 0) >= 0 ? '+' : ''}
                                                    ${challenges.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                
                                {/* Travel Distance */}
                                {travel.length > 0 && (
                                    <>
                                        {travel.map((item: any, index: number) => (
                                            <TableRow key={`travel-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                                        <Navigation className="w-3 h-3 mr-1" />
                                                        Travel
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-indigo-700">
                                                    +${item.price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {travel.length > 1 && (
                                            <TableRow className="bg-indigo-50/30">
                                                <TableCell colSpan={2} className="font-medium text-indigo-800 px-2">
                                                    Travel Costs Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-indigo-800">
                                                    +${travel.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                
                                {/* Additional Services */}
                                {additionalServices.length > 0 && (
                                    <>
                                        {additionalServices.map((item: any, index: number) => (
                                            <TableRow key={`additional-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        Add-on
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-emerald-700">
                                                    +${item.price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {additionalServices.length > 1 && (
                                            <TableRow className="bg-emerald-50/30">
                                                <TableCell colSpan={2} className="font-medium text-emerald-800 px-2">
                                                    Add-on Services Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-emerald-800">
                                                    +${additionalServices.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                
                                {/* Supplies */}
                                {supplies.length > 0 && (
                                    <>
                                        {supplies.map((item: any, index: number) => (
                                            <TableRow key={`supply-${index}`}>
                                                <TableCell className="px-2">
                                                    <div>
                                                        <div className="font-medium text-foreground">{item.item}</div>
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-2">
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                        <Boxes className="w-3 h-3 mr-1" />
                                                        Supplies
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-yellow-700">
                                                    +${item.price.toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {supplies.length > 1 && (
                                            <TableRow className="bg-yellow-50/30">
                                                <TableCell colSpan={2} className="font-medium text-yellow-800 px-2">
                                                    Moving Supplies Subtotal
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-yellow-800">
                                                    +${supplies.reduce((sum: number, item: any) => sum + item.price, 0).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="font-semibold text-lg px-2">Subtotal</TableCell>
                                    <TableCell className="text-right font-semibold text-lg px-2">${subtotal.toLocaleString()}</TableCell>
                                </TableRow>
                                {taxTotal > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="px-2">
                                            <div className="flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Tax (8.0%)</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold px-2">${taxTotal.toLocaleString()}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow className="bg-primary/5">
                                    <TableCell colSpan={2} className="font-bold text-xl text-primary px-2">Total Amount</TableCell>
                                    <TableCell className="text-right font-bold text-xl text-primary px-2">${estimate.total_price.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Card>

                {/* Move Details */}
                <div className="space-y-6">
                    {/* Address Details */}
                    <Card>
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Move Locations</h3>
                                    <p className="text-sm text-muted-foreground">Pickup and destination addresses</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {moveDetails.pickupAddress && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        <span className="font-medium text-green-700">Pickup Address</span>
                                    </div>
                                    <div className="pl-5 text-muted-foreground">
                                        <p className="font-medium text-foreground">{moveDetails.pickupAddress.address}</p>
                                        <p>
                                            {moveDetails.pickupAddress.city}, {moveDetails.pickupAddress.state} {moveDetails.pickupAddress.zip}
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {moveDetails.destinationAddress && (
                                <Separator />
                            )}
                            
                            {moveDetails.destinationAddress && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-primary rounded-full" />
                                        <span className="font-medium text-primary">Destination Address</span>
                                    </div>
                                    <div className="pl-5 text-muted-foreground">
                                        <p className="font-medium text-foreground">{moveDetails.destinationAddress.address}</p>
                                        <p>
                                            {moveDetails.destinationAddress.city}, {moveDetails.destinationAddress.state} {moveDetails.destinationAddress.zip}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Contact Details</h3>
                                    <p className="text-sm text-muted-foreground">Your information for follow-up</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {contactInfo.first_name && (
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {contactInfo.first_name} {contactInfo.last_name || ''}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Customer Name</p>
                                    </div>
                                </div>
                            )}
                            
                            {contactInfo.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-foreground">{contactInfo.email}</p>
                                        <p className="text-sm text-muted-foreground">Email Address</p>
                                    </div>
                                </div>
                            )}
                            
                            {contactInfo.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-foreground">{contactInfo.phone}</p>
                                        <p className="text-sm text-muted-foreground">Phone Number</p>
                                    </div>
                                </div>
                            )}
                            
                            {contactInfo.preferred_contact && (
                                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Preferred Contact Method</p>
                                    <Badge variant="secondary" className="capitalize">
                                        {contactInfo.preferred_contact}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-4 pt-8 border-t border-border">
                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={() => {
                                setEstimate(null);
                                setCurrentStep(0);
                                setResponses({});
                                setError(null);
                                setWidgetConfig(null);
                                setRouteData(null);
                            }}
                            variant="outline"
                            size="lg"
                            className="min-w-[120px]"
                        >
                            <Calculator className="w-4 h-4 mr-2" />
                            Test Again
                        </Button>
                        <Button onClick={onClose} size="lg" className="min-w-[120px]">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Done
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                clearProgressFromStorage();
                                console.log('🗑️ Session data cleared by user');
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                        >
                            Clear Session Data
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    // Render full-screen version for iframe embedding
    if (fullScreen) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                {/* Header */}
                <div className="py-4 sm:py-6 px-4 sm:px-6 border-b border-border bg-background">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-foreground">Get Your Quote</h1>
                                <p className="text-sm text-muted-foreground">{widget.name}</p>
                            </div>
                        </div>

                        {!estimate && stepOrder.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                    <span>Step {currentStep + 1} of {stepOrder.length}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentStep + 1) / stepOrder.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                    <div className="max-w-2xl mx-auto">
                        {error && (
                            <Card className="p-4 mb-6 border-destructive/50 bg-destructive/10">
                                <div className="text-destructive font-medium">{error}</div>
                            </Card>
                        )}

                        {estimate ? (
                            <div className="space-y-6">
                                {renderEstimate()}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {currentStepId && currentStepConfig && renderStep(currentStepConfig, currentStepId)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {!estimate && (
                    <div className="border-t border-border bg-background px-4 sm:px-6 py-4">
                        <div className="max-w-2xl mx-auto">
                            <div className="flex justify-between space-x-4">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </Button>
                                
                                <Button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                >
                                    {isLastStep ? (
                                        <>
                                            Complete Estimate
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-2xl">
                <SheetHeader>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <SheetTitle>Test Estimate</SheetTitle>
                            <SheetDescription>{widget.name}</SheetDescription>
                        </div>
                    </div>

                    {!estimate && stepOrder.length > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                <span>Step {currentStep + 1} of {stepOrder.length}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / stepOrder.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto max-w-2xl mx-auto px-8 w-full">
                    {error && (
                        <Card className="p-4 mb-6 border-destructive/50 bg-destructive/10">
                            <div className="text-destructive font-medium">{error}</div>
                        </Card>
                    )}

                    {showResumeOption && savedProgress ? (
                        <div className="space-y-6">
                            {/* Welcome back card */}
                            <Card className="p-6 bg-primary/5 border-primary/20">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                                        <ArrowRight className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">Welcome Back!</h3>
                                        <p className="text-muted-foreground mb-4">
                                            We found your previous estimate progress for <span className="font-medium">{savedProgress.widgetName}</span>
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <span>Step {savedProgress.currentStep + 1} of {stepOrder.length}</span>
                                            <span>•</span>
                                            <span>Saved {new Date(savedProgress.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            
                            {/* Progress preview with move details */}
                            <Card className="p-6">
                                <div className="flex items-center space-x-6">
                                    {/* Progress indicator on left */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 relative">
                                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeDasharray="100, 100"
                                                    className="text-muted stroke-2"
                                                />
                                                <path
                                                    d="M18 2.0845
                                                    a 15.9155 15.9155 0 0 1 0 31.831
                                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeDasharray={`${Math.round((Object.keys(savedProgress.responses).length / (widgetConfig?.step_order?.length || 1)) * 100)}, 100`}
                                                    className="text-primary"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {Math.round((Object.keys(savedProgress.responses).length / (widgetConfig?.step_order?.length || 1)) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center mt-1">
                                            <p className="text-xs text-muted-foreground">Complete</p>
                                        </div>
                                    </div>
                                    
                                    {/* Move details on right */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold text-foreground text-lg">
                                                    {(() => {
                                                        // Extract service type with proper title lookup
                                                        const serviceStepEntry = Object.entries(savedProgress.responses).find(([key, response]: [string, any]) => 
                                                            key.includes('service') && response.selectedOption
                                                        );
                                                        if (serviceStepEntry && widgetConfig) {
                                                            const [stepId, response] = serviceStepEntry;
                                                            const stepConfig = widgetConfig.steps_data[stepId];
                                                            if (stepConfig?.options) {
                                                                const selectedOption = stepConfig.options.find((opt: any) => opt.id === response.selectedOption);
                                                                if (selectedOption?.title) {
                                                                    return selectedOption.title;
                                                                }
                                                            }
                                                        }
                                                        return 'Moving Service';
                                                    })()}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {(() => {
                                                        // Extract move size with proper title lookup
                                                        const sizeStepEntry = Object.entries(savedProgress.responses).find(([key, response]: [string, any]) => 
                                                            (key.includes('size') || key.includes('scope') || key.includes('bedroom')) && response.selectedOption
                                                        );
                                                        if (sizeStepEntry && widgetConfig) {
                                                            const [stepId, response] = sizeStepEntry;
                                                            const stepConfig = widgetConfig.steps_data[stepId];
                                                            if (stepConfig?.options) {
                                                                const selectedOption = stepConfig.options.find((opt: any) => opt.id === response.selectedOption);
                                                                if (selectedOption?.title) {
                                                                    return selectedOption.title;
                                                                }
                                                            }
                                                        }
                                                        return 'Details to be completed';
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Date and time if available */}
                                        {(() => {
                                            const dateResponse = Object.values(savedProgress.responses).find((r: any) => r.selectedDate);
                                            const timeStepEntry = Object.entries(savedProgress.responses).find(([key, response]: [string, any]) => 
                                                key.includes('time') && response.selectedOption
                                            );
                                            
                                            if (dateResponse || timeStepEntry) {
                                                let timeDisplay = '';
                                                if (timeStepEntry && widgetConfig) {
                                                    const [stepId, response] = timeStepEntry;
                                                    const stepConfig = widgetConfig.steps_data[stepId];
                                                    if (stepConfig?.options) {
                                                        const selectedOption = stepConfig.options.find((opt: any) => opt.id === response.selectedOption);
                                                        if (selectedOption?.title) {
                                                            timeDisplay = selectedOption.title;
                                                        }
                                                    }
                                                }
                                                
                                                return (
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">
                                                            {dateResponse?.selectedDate ? new Date(dateResponse.selectedDate).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'long', 
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }) : 'Date to be selected'}
                                                            {timeDisplay && ` • ${timeDisplay}`}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        })()}
                                        
                                        {/* Addresses if available */}
                                        {(() => {
                                            const pickupResponse = Object.entries(savedProgress.responses).find(([key, response]: [string, any]) => 
                                                (key.includes('pickup') || key.includes('origin')) && response.address
                                            );
                                            const destResponse = Object.entries(savedProgress.responses).find(([key, response]: [string, any]) => 
                                                (key.includes('destination') || key.includes('target')) && response.address
                                            );
                                            
                                            if (pickupResponse || destResponse) {
                                                return (
                                                    <div className="space-y-1">
                                                        {pickupResponse && (
                                                            <div className="flex items-start space-x-2">
                                                                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <span className="text-sm text-muted-foreground truncate">
                                                                    From: {pickupResponse[1].address.length > 35 ? 
                                                                        pickupResponse[1].address.substring(0, 35) + '...' : 
                                                                        pickupResponse[1].address
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {destResponse && (
                                                            <div className="flex items-start space-x-2">
                                                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                                <span className="text-sm text-muted-foreground truncate">
                                                                    To: {destResponse[1].address.length > 35 ? 
                                                                        destResponse[1].address.substring(0, 35) + '...' : 
                                                                        destResponse[1].address
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </Card>

                            {/* Action buttons */}
                            <div className="flex flex-col space-y-3">
                                <Button
                                    onClick={resumeSavedSession}
                                    className="w-full"
                                    size="lg"
                                >
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                    Continue where I left off
                                </Button>
                                
                                <Button
                                    onClick={startFreshSession}
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    Start fresh estimate (clears saved data)
                                </Button>
                            </div>
                        </div>
                    ) : estimate ? (
                        renderEstimateResults()
                    ) : isCalculating ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">Calculating Estimate</h3>
                                <p className="text-muted-foreground">Please wait while we process your responses...</p>
                            </div>
                        </div>
                    ) : isLoadingConfig ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-semibold mb-2">Loading Configuration</h3>
                                <p className="text-muted-foreground">Preparing your widget for testing...</p>
                            </div>
                        </div>
                    ) : currentStepConfig ? (
                        renderStep(currentStepConfig, currentStepId)
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No steps configured for testing.</p>
                        </div>
                    )}
                </div>

                {!estimate && !isCalculating && !isLoadingConfig && stepOrder.length > 0 && (
                    <SheetFooter>
                        <div className="flex items-center justify-between w-full">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            {(() => {
                                const canProceedValue = canProceed();
                                console.log('Button render - canProceed:', canProceedValue, 'disabled:', !canProceedValue);
                                return (
                                    <Button
                                        onClick={handleNext}
                                        disabled={!canProceedValue}
                                    >
                                {isLastStep ? (
                                    <>
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Calculate Estimate
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                                    </Button>
                                );
                            })()}
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>

        </Sheet>
    );
}