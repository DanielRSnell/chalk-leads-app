import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Target, TrendingUp, Users, BarChart3, ArrowRight, Sparkles, Code, Copy, X, ExternalLink } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    user: {
        name: string;
        company: {
            name: string;
        };
    };
    widgets?: Array<{
        id: number;
        name: string;
        widget_key: string;
        status: string;
        created_at: string;
    }>;
    widgetCount: number;
    leadCount: number;
}

export default function ChalkDashboard({ user, widgets = [], widgetCount = 0, leadCount = 0 }: DashboardProps) {
    const [selectedWidgetForApi, setSelectedWidgetForApi] = useState<any>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const isFirstTime = widgetCount === 0;
    
    const copyToClipboard = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Chalk" />
            
            <div className="p-6 space-y-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, <span className="text-gradient-chalk">{user.name}!</span>
                            </h1>
                            <p className="text-gray-600">
                                {isFirstTime 
                                    ? `Let's create your first lead widget for ${user.company.name}`
                                    : `Here's how ${user.company.name} is performing`
                                }
                            </p>
                        </div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                className="btn-chalk-gradient"
                                onClick={() => window.location.href = route('widgets.create')}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Widget
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {isFirstTime ? (
                    // First-time user onboarding
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* Getting Started Hero */}
                        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl p-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-chalk rounded-xl flex items-center justify-center mr-4">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Let's build your first widget!</h2>
                                        <p className="text-gray-600">Transform your website visitors into qualified leads in just minutes</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Zap className="w-4 h-4 mr-1 text-purple-500" />
                                            5 min setup
                                        </div>
                                        <div className="flex items-center">
                                            <Target className="w-4 h-4 mr-1 text-purple-500" />
                                            95% conversion rate
                                        </div>
                                        <div className="flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1 text-purple-500" />
                                            Instant results
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        className="btn-chalk-gradient"
                                        onClick={() => window.location.href = route('widgets.create')}
                                    >
                                        Get Started
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* How It Works */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <Card className="p-6 h-full border-2 border-transparent hover:border-purple-200 transition-colors">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Choose Your Service</h3>
                                    <p className="text-gray-600 text-sm">Select from moving, home services, or any other industry. Our templates adapt to your needs.</p>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <Card className="p-6 h-full border-2 border-transparent hover:border-purple-200 transition-colors">
                                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Customize Experience</h3>
                                    <p className="text-gray-600 text-sm">Set up modules, pricing, and branding to match your business perfectly.</p>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <Card className="p-6 h-full border-2 border-transparent hover:border-purple-200 transition-colors">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Deploy & Convert</h3>
                                    <p className="text-gray-600 text-sm">Embed on your site and start converting visitors into qualified leads instantly.</p>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Example Preview */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">See what you'll build</h3>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="w-16 h-16 bg-gradient-chalk rounded-2xl flex items-center justify-center mx-auto">
                                        <div className="text-white text-2xl">🏠</div>
                                    </div>
                                    <h4 className="text-xl font-semibold">How can we help you today?</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-lg p-3 border-2 border-purple-200 cursor-pointer">
                                            <div className="text-lg mb-1">🚛</div>
                                            <div className="text-sm font-medium">Full Service Moving</div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-purple-200">
                                            <div className="text-lg mb-1">💪</div>
                                            <div className="text-sm font-medium">Labor Only</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Interactive widget preview</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    // Existing user dashboard
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Widgets</p>
                                        <p className="text-2xl font-bold text-gray-900">{widgetCount}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                                        <p className="text-2xl font-bold text-gray-900">{leadCount}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                        <p className="text-2xl font-bold text-gray-900">85%</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">This Month</p>
                                        <p className="text-2xl font-bold text-gray-900">+24%</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Recent Widgets</h3>
                                <div className="space-y-3">
                                    {widgets.length > 0 ? (
                                        widgets.map((widget) => (
                                            <div key={widget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                                        <Zap className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{widget.name}</p>
                                                        <p className="text-xs text-gray-500">Created {widget.created_at}</p>
                                                        <p className="text-xs text-gray-400">Status: {widget.status}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => setSelectedWidgetForApi(widget)}
                                                        className="flex items-center"
                                                    >
                                                        <Code className="w-4 h-4 mr-1" />
                                                        API
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => window.location.href = route('widgets.edit', { widget: widget.id })}
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm">No widgets created yet.</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <BarChart3 className="w-5 h-5 text-gray-400 mr-3" />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Widget Views</span>
                                                <span className="font-medium">1,234</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-gray-400 mr-3" />
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Conversions</span>
                                                <span className="font-medium">987</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </div>
            
            {/* API Information Modal */}
            <AnimatePresence>
                {selectedWidgetForApi && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedWidgetForApi(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-chalk rounded-xl flex items-center justify-center">
                                            <Code className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">API Integration</h2>
                                            <p className="text-gray-600">Widget: {selectedWidgetForApi.name}</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setSelectedWidgetForApi(null)}
                                        className="flex items-center"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                                {/* API Endpoint */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <ExternalLink className="w-5 h-5 mr-2 text-purple-600" />
                                        API Endpoint
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">GET Request URL</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => copyToClipboard(`${window.location.origin}/api/widget/${selectedWidgetForApi.widget_key}/config`, 'endpoint')}
                                                className="text-xs"
                                            >
                                                {copiedField === 'endpoint' ? (
                                                    <>✓ Copied</>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <code className="text-sm font-mono bg-white p-3 rounded border block break-all">
                                            {window.location.origin}/api/widget/{selectedWidgetForApi.widget_key}/config
                                        </code>
                                    </div>
                                </div>
                                
                                {/* Widget Key */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Widget Key</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Unique Identifier</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => copyToClipboard(selectedWidgetForApi.widget_key, 'key')}
                                                className="text-xs"
                                            >
                                                {copiedField === 'key' ? (
                                                    <>✓ Copied</>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <code className="text-sm font-mono bg-white p-3 rounded border block">
                                            {selectedWidgetForApi.widget_key}
                                        </code>
                                    </div>
                                </div>
                                
                                {/* JavaScript Example */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript Example</h3>
                                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-300">Fetch API</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => copyToClipboard(`// Fetch widget configuration\nfetch('${window.location.origin}/api/widget/${selectedWidgetForApi.widget_key}/config')\n  .then(response => response.json())\n  .then(config => {\n    console.log('Widget Config:', config);\n    // Use config to render your widget\n  })\n  .catch(error => {\n    console.error('Error fetching widget config:', error);\n  });`, 'javascript')}
                                                className="text-xs bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                            >
                                                {copiedField === 'javascript' ? (
                                                    <>✓ Copied</>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <pre className="text-sm text-gray-300 overflow-x-auto">
                                            <code>{`// Fetch widget configuration
fetch('${window.location.origin}/api/widget/${selectedWidgetForApi.widget_key}/config')
  .then(response => response.json())
  .then(config => {
    console.log('Widget Config:', config);
    // Use config to render your widget
  })
  .catch(error => {
    console.error('Error fetching widget config:', error);
  });`}</code>
                                        </pre>
                                    </div>
                                </div>
                                
                                {/* cURL Example */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">cURL Example</h3>
                                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-300">Command Line</span>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => copyToClipboard(`curl -X GET "${window.location.origin}/api/widget/${selectedWidgetForApi.widget_key}/config" \\
  -H "Accept: application/json"`, 'curl')}
                                                className="text-xs bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                            >
                                                {copiedField === 'curl' ? (
                                                    <>✓ Copied</>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 mr-1" />
                                                        Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <pre className="text-sm text-gray-300 overflow-x-auto">
                                            <code>{`curl -X GET "${window.location.origin}/api/widget/${selectedWidgetForApi.widget_key}/config" \\
  -H "Accept: application/json"`}</code>
                                        </pre>
                                    </div>
                                </div>
                                
                                {/* Response Format */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Format</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 border">
                                        <p className="text-sm text-gray-600 mb-3">
                                            The API returns a JSON object containing all widget configuration:
                                        </p>
                                        <div className="bg-white rounded border p-3">
                                            <pre className="text-xs text-gray-700 overflow-x-auto">
                                                <code>{`{
  "widget": {
    "id": ${selectedWidgetForApi.id},
    "name": "${selectedWidgetForApi.name}",
    "widget_key": "${selectedWidgetForApi.widget_key}",
    "company_name": "...",
    "enabled_modules": [...],
    "module_configs": {
      "service-selection": { ... },
      "project-scope": { ... },
      ...
    },
    "branding": {
      "primary_color": "#8B5CF6",
      "secondary_color": "#EC4899"
    },
    "settings": { ... }
  }
}`}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Integration Tips */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Tips</h3>
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <ul className="text-sm text-blue-800 space-y-2">
                                            <li className="flex items-start">
                                                <span className="font-bold mr-2">•</span>
                                                <span>Use the <code className="bg-blue-100 px-1 rounded text-xs">module_configs</code> to build your widget UI dynamically</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="font-bold mr-2">•</span>
                                                <span>The <code className="bg-blue-100 px-1 rounded text-xs">enabled_modules</code> array defines the order and flow</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="font-bold mr-2">•</span>
                                                <span>Apply the <code className="bg-blue-100 px-1 rounded text-xs">branding</code> colors to match your design</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="font-bold mr-2">•</span>
                                                <span>Use <code className="bg-blue-100 px-1 rounded text-xs">settings</code> for global configuration like tax rates and pricing</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}