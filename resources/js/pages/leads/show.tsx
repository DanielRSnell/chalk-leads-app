import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Users,
    Mail,
    Phone,
    ArrowLeft,
    Code,
    Globe,
    Monitor,
    MapPin,
    Calendar,
    Clock,
    Package,
    DollarSign,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatFormResponse } from '@/lib/leadResponseFormatter';

interface Lead {
    id: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    form_responses: Record<string, any>;
    estimate_breakdown: Array<{
        item: string;
        description: string;
        price: number;
        type: string;
    }>;
    base_price: number;
    subtotal: number;
    tax_amount: number;
    total_price: number;
    formatted_total: string;
    source_url: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    updated_at: string;
    widget: {
        id: number;
        name: string;
        widget_key: string;
        module_configs: Record<string, any>;
    };
}

interface LeadShowProps {
    lead: Lead;
}

export default function LeadShow({ lead }: LeadShowProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Leads', href: '/leads' },
        { title: `Lead #${lead.id}`, href: `/leads/${lead.id}` },
    ];

    const getStatusBadge = (status: string) => {
        const config: Record<
            string,
            { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
        > = {
            new: {
                variant: 'default',
                className: 'bg-blue-500 hover:bg-blue-600 text-white',
            },
            contacted: {
                variant: 'secondary',
                className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            },
            converted: {
                variant: 'outline',
                className: 'bg-green-500 hover:bg-green-600 text-white',
            },
            lost: {
                variant: 'destructive',
                className: '',
            },
        };

        const { variant, className } = config[status] || config.new;

        return (
            <Badge variant={variant} className={className}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleStatusChange = (newStatus: string) => {
        setIsUpdatingStatus(true);
        router.put(
            `/leads/${lead.id}/status`,
            { status: newStatus },
            {
                onFinish: () => setIsUpdatingStatus(false),
                preserveScroll: true,
            }
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const getModuleLabel = (key: string): string => {
        const labels: Record<string, string> = {
            'service-selection': 'Service Selection',
            'service-type': 'Service Type',
            'location-type': 'Location Type',
            'project-scope': 'Project Scope',
            'date-selection': 'Preferred Date',
            'time-selection': 'Preferred Time',
            'origin-location': 'Pickup Location',
            'origin-challenges': 'Pickup Challenges',
            'target-location': 'Destination',
            'target-challenges': 'Destination Challenges',
            'distance-calculation': 'Distance & Route',
            'additional-services': 'Additional Services',
            'supply-selection': 'Moving Supplies',
            'contact-info': 'Contact Information',
        };
        return labels[key] || key.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderFormResponse = (key: string, value: any) => {
        if (!value) return null;

        // Use the formatter to get structured response data
        const formatted = formatFormResponse(key, value, lead.widget.module_configs);

        // Render based on the formatted type
        switch (formatted.type) {
            case 'location':
                return (
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">{formatted.data.address}</p>
                            {formatted.data.coordinates && (
                                <p className="text-xs text-muted-foreground">
                                    {formatted.data.coordinates.lat?.toFixed(4)}, {formatted.data.coordinates.lng?.toFixed(4)}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 'date':
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">{formatted.data}</span>
                    </div>
                );

            case 'distance':
                return (
                    <div className="space-y-1">
                        <p className="font-medium">{formatted.data.distance} miles</p>
                        {formatted.data.duration && <p className="text-sm text-muted-foreground">{formatted.data.duration} minutes</p>}
                        {formatted.data.route && <p className="text-xs text-muted-foreground">Via {formatted.data.route}</p>}
                    </div>
                );

            case 'multiple-selection':
                return (
                    <div className="space-y-1">
                        {formatted.data.length > 0 ? (
                            formatted.data.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-muted-foreground">None selected</span>
                        )}
                    </div>
                );

            case 'supplies':
                if (!formatted.data.needsSupplies) {
                    return <span className="text-muted-foreground">No supplies needed</span>;
                }
                return (
                    <div className="space-y-1">
                        {Object.entries(formatted.data.selectedSupplies || {}).map(([item, qty]: [string, any]) => (
                            <div key={item} className="flex items-center gap-2 text-sm">
                                <Package className="w-3.5 h-3.5 text-primary" />
                                <span>
                                    {item.split('-').join(' ')}: <strong>{qty}</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                );

            case 'single-selection':
            case 'value':
            case 'input':
            case 'confirmation':
                return <p className="font-medium">{formatted.data}</p>;

            case 'empty':
                return <span className="text-muted-foreground">Not provided</span>;

            case 'raw':
            default:
                return <p className="font-medium">{JSON.stringify(formatted.data)}</p>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Lead #${lead.id}`} />
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" asChild>
                                <Link href="/leads">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    Lead #{lead.id}
                                </h1>
                                <p className="text-gray-600">
                                    Submitted {lead.created_at}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {getStatusBadge(lead.status)}
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Contact & Widget Info */}
                    <motion.div
                        className="lg:col-span-1 space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {/* Contact Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </label>
                                    <p className="text-base font-medium mt-1">{lead.contact_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <a
                                        href={`mailto:${lead.contact_email}`}
                                        className="flex items-center gap-2 text-base text-primary hover:underline mt-1"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {lead.contact_email}
                                    </a>
                                </div>
                                {lead.contact_phone && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </label>
                                        <a
                                            href={`tel:${lead.contact_phone}`}
                                            className="flex items-center gap-2 text-base text-primary hover:underline mt-1"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {lead.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Widget Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                Widget Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Widget
                                    </label>
                                    <Link
                                        href={`/widgets/${lead.widget.id}/edit`}
                                        className="text-base font-medium text-primary hover:underline mt-1 block"
                                    >
                                        {lead.widget.name}
                                    </Link>
                                </div>
                                {lead.source_url && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Source URL
                                        </label>
                                        <a
                                            href={lead.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline mt-1 break-all"
                                        >
                                            <Globe className="w-4 h-4 shrink-0" />
                                            {lead.source_url}
                                        </a>
                                    </div>
                                )}
                                {lead.ip_address && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            IP Address
                                        </label>
                                        <p className="text-sm mt-1">{lead.ip_address}</p>
                                    </div>
                                )}
                                {lead.user_agent && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                            <Monitor className="w-3.5 h-3.5" />
                                            Browser
                                        </label>
                                        <p className="text-xs text-muted-foreground mt-1 break-all">
                                            {lead.user_agent}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Status Management */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                            <Select
                                value={lead.status}
                                onValueChange={handleStatusChange}
                                disabled={isUpdatingStatus}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                    <SelectItem value="lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </Card>
                    </motion.div>

                    {/* Right Column - Form Responses & Estimate */}
                    <motion.div
                        className="lg:col-span-2 space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {/* Form Responses */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Form Responses</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(lead.form_responses).map(([key, value]) => {
                                    if (key === 'contact-info') return null; // Already shown in contact card
                                    return (
                                        <div key={key} className="p-4 border rounded-lg bg-muted/30">
                                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                                {getModuleLabel(key)}
                                            </label>
                                            {renderFormResponse(key, value)}
                                        </div>
                                    );
                                })}
                            </div>
                            {Object.keys(lead.form_responses).length === 0 && (
                                <p className="text-muted-foreground text-center py-8">
                                    No form responses available
                                </p>
                            )}
                        </Card>

                        {/* Estimate Breakdown */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                Estimate Breakdown
                            </h3>
                            {lead.estimate_breakdown && lead.estimate_breakdown.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="text-left p-3 text-sm font-semibold">
                                                        Item
                                                    </th>
                                                    <th className="text-left p-3 text-sm font-semibold">
                                                        Description
                                                    </th>
                                                    <th className="text-right p-3 text-sm font-semibold">
                                                        Price
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lead.estimate_breakdown.map((item, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-t hover:bg-muted/30 transition-colors"
                                                    >
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {item.type}
                                                                </Badge>
                                                                <span className="font-medium">{item.item}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-sm text-muted-foreground">
                                                            {item.description}
                                                        </td>
                                                        <td className="p-3 text-right font-mono">
                                                            {formatCurrency(item.price)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        {lead.subtotal && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-mono">{formatCurrency(lead.subtotal)}</span>
                                            </div>
                                        )}
                                        {lead.tax_amount && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tax</span>
                                                <span className="font-mono">{formatCurrency(lead.tax_amount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                            <span>Total</span>
                                            <span className="font-mono text-primary">
                                                {lead.formatted_total || formatCurrency(lead.total_price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">
                                    No estimate breakdown available
                                </p>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
