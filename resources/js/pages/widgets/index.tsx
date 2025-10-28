import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Code, Edit, Eye, Plus, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Widgets',
        href: '/widgets',
    },
];

interface Widget {
    id: number;
    name: string;
    widget_key: string;
    status: string;
    service_category: string;
    created_at: string;
}

interface WidgetsPageProps {
    widgets: Widget[];
}

export default function WidgetsIndex({ widgets }: WidgetsPageProps) {
    const [embedWidgetKey, setEmbedWidgetKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            published: 'default',
            draft: 'secondary',
            archived: 'outline',
        };

        return (
            <Badge variant={variants[status] || 'secondary'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getPreviewUrl = (widgetKey: string) => {
        return `/widgets/${widgetKey}/live`;
    };

    const getEmbedCode = (widgetKey: string) => {
        const previewUrl = window.location.origin + getPreviewUrl(widgetKey);
        return `<iframe src="${previewUrl}" width="100%" height="600" frameborder="0" style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></iframe>`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Widgets" />
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Widgets</h1>
                            <p className="text-gray-600">
                                Manage your service widgets and embed codes
                            </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/widgets/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Widget
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Widgets Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card className="p-6">
                        {widgets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Code className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No widgets yet</h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    Create your first widget to start capturing leads and converting visitors.
                                </p>
                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Link href="/widgets/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Widget
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">Name</TableHead>
                                            <TableHead className="font-semibold">Category</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Created</TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {widgets.map((widget) => (
                                            <TableRow key={widget.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium text-gray-900">
                                                    {widget.name}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {widget.service_category || 'N/A'}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(widget.status)}</TableCell>
                                                <TableCell className="text-gray-600">{widget.created_at}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/widgets/${widget.id}/preview`}>
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                Preview
                                                            </Link>
                                                        </Button>

                                                        <Dialog
                                                            open={embedWidgetKey === widget.widget_key}
                                                            onOpenChange={(open) => {
                                                                setEmbedWidgetKey(open ? widget.widget_key : null);
                                                                if (!open) setCopied(false);
                                                            }}
                                                        >
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm">
                                                                    <Code className="h-4 w-4 mr-1" />
                                                                    Embed
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Embed Code</DialogTitle>
                                                                    <DialogDescription>
                                                                        Copy and paste this code into your website to embed <span className="font-medium text-foreground">{widget.name}</span>
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="space-y-6 py-4">
                                                                    {/* Widget URL */}
                                                                    <div className="space-y-3">
                                                                        <label className="text-sm font-medium leading-none">
                                                                            Widget URL
                                                                        </label>
                                                                        <div className="flex items-start gap-2">
                                                                            <div className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 min-h-[42px] flex items-center">
                                                                                <code className="text-xs font-mono break-all">
                                                                                    {window.location.origin + getPreviewUrl(widget.widget_key)}
                                                                                </code>
                                                                            </div>
                                                                            <Button
                                                                                size="icon"
                                                                                variant="outline"
                                                                                className="shrink-0 h-[42px] w-[42px]"
                                                                                onClick={() => copyToClipboard(window.location.origin + getPreviewUrl(widget.widget_key))}
                                                                            >
                                                                                {copied ? (
                                                                                    <Check className="h-4 w-4" />
                                                                                ) : (
                                                                                    <Copy className="h-4 w-4" />
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Embed Code */}
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <label className="text-sm font-medium leading-none">
                                                                                HTML Embed Code
                                                                            </label>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="secondary"
                                                                                onClick={() => copyToClipboard(getEmbedCode(widget.widget_key))}
                                                                            >
                                                                                {copied ? (
                                                                                    <>
                                                                                        <Check className="h-3.5 w-3.5 mr-1.5" />
                                                                                        Copied
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                                                                                        Copy
                                                                                    </>
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                        <div className="rounded-md border border-input bg-muted/50">
                                                                            <pre className="p-4 overflow-x-auto">
                                                                                <code className="text-xs font-mono block break-all whitespace-pre-wrap">
                                                                                    {getEmbedCode(widget.widget_key)}
                                                                                </code>
                                                                            </pre>
                                                                        </div>
                                                                    </div>

                                                                    {/* Instructions */}
                                                                    <div className="rounded-md border border-input bg-muted/30 p-4">
                                                                        <h4 className="text-sm font-semibold mb-3">Quick Start</h4>
                                                                        <ol className="text-sm space-y-2 list-decimal list-inside marker:text-muted-foreground marker:font-medium">
                                                                            <li className="pl-2">Copy the HTML embed code above</li>
                                                                            <li className="pl-2">Paste it into your website's HTML where you want the widget to appear</li>
                                                                            <li className="pl-2">The widget will automatically load and be ready to capture leads</li>
                                                                        </ol>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/widgets/${widget.id}/edit`}>
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
