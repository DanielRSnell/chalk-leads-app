import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import EstimateTestDrawer from '@/components/EstimateTestDrawer';

interface LivePreviewProps {
    widget: {
        id: number;
        name: string;
        company_name: string;
        enabled_modules: string[];
        module_configs: Record<string, any>;
        branding?: {
            primary_color?: string;
            secondary_color?: string;
        };
        settings?: Record<string, any>;
        company: {
            id: number;
            name: string;
        };
    };
    fullScreen?: boolean;
}

export default function LivePreview({ widget, fullScreen = false }: LivePreviewProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    return (
        <>
            <Head title={`Live Preview - ${widget.name}`} />
            
            {/* Full Screen Layout */}
            <div className="min-h-screen bg-background">
                {/* Header Bar */}
                <div className="bg-white border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-foreground">
                                Live Preview: {widget.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {widget.company_name} • Preview Mode
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-muted-foreground">Live Preview</span>
                            </div>
                            {!isDrawerOpen && (
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Open Widget
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Widget Live Preview
                            </h2>
                            <p className="text-muted-foreground">
                                This is how your widget will appear to customers. 
                                {isDrawerOpen ? ' The widget is currently open.' : ' Click "Open Widget" to interact with it.'}
                            </p>
                        </div>
                        
                        {!isDrawerOpen && (
                            <div className="bg-muted/20 rounded-lg p-6 max-w-md mx-auto">
                                <h3 className="font-semibold mb-2">Widget Configuration</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Modules:</span>
                                        <span>{widget.enabled_modules?.length || 0} enabled</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Company:</span>
                                        <span>{widget.company_name}</span>
                                    </div>
                                    {widget.branding?.primary_color && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Theme:</span>
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-4 h-4 rounded-full border" 
                                                    style={{ backgroundColor: widget.branding.primary_color }}
                                                ></div>
                                                <span className="text-xs font-mono">
                                                    {widget.branding.primary_color}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Full Screen Widget Component - Custom Implementation */}
                {isDrawerOpen && (
                    <div className="fixed inset-0 bg-background z-50">
                        <div className="h-full max-w-2xl mx-auto px-8 w-full">
                            {/* Widget Header */}
                            <div className="py-6 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                            <Calculator className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-semibold text-foreground">Test Estimate</h1>
                                            <p className="text-sm text-muted-foreground">{widget.name}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            
                            {/* Widget Content */}
                            <div className="h-[calc(100vh-140px)]">
                                <EstimateTestDrawer
                                    isOpen={true}
                                    onClose={() => setIsDrawerOpen(false)}
                                    widget={widget}
                                    fullScreen={fullScreen}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}