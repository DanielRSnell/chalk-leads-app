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
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Users, Mail, Phone, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Leads',
        href: '/leads',
    },
];

interface Lead {
    id: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    widget_name: string;
    widget_id: number;
    total_price: string;
    formatted_total: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    created_at: string;
}

interface LeadsPageProps {
    leads: Lead[];
}

export default function LeadsIndex({ leads }: LeadsPageProps) {
    const getStatusBadge = (status: string) => {
        const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
            new: { variant: 'default', label: 'New' },
            contacted: { variant: 'secondary', label: 'Contacted' },
            converted: { variant: 'outline', label: 'Converted' },
            lost: { variant: 'destructive', label: 'Lost' },
        };

        const { variant, label } = config[status] || { variant: 'secondary', label: status };

        return (
            <Badge variant={variant} className={
                status === 'new' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                status === 'contacted' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                status === 'converted' ? 'bg-green-500 hover:bg-green-600 text-white' :
                ''
            }>
                {label}
            </Badge>
        );
    };

    const formatCurrency = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(num);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
                            <p className="text-gray-600">
                                View and manage all leads from your widgets
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">{leads.length}</span> total leads
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card className="p-6">
                        {leads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    Leads will appear here once visitors submit your widgets. Make sure your widgets are published and embedded on your website.
                                </p>
                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Link href="/widgets">
                                        View Widgets
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">Contact</TableHead>
                                            <TableHead className="font-semibold">Email</TableHead>
                                            <TableHead className="font-semibold">Phone</TableHead>
                                            <TableHead className="font-semibold">Widget</TableHead>
                                            <TableHead className="font-semibold">Total</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leads.map((lead) => (
                                            <TableRow key={lead.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell className="font-medium text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                            <Users className="w-4 h-4 text-primary" />
                                                        </div>
                                                        {lead.contact_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <a
                                                            href={`mailto:${lead.contact_email}`}
                                                            className="hover:text-primary hover:underline"
                                                        >
                                                            {lead.contact_email}
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <a
                                                            href={`tel:${lead.contact_phone}`}
                                                            className="hover:text-primary hover:underline"
                                                        >
                                                            {lead.contact_phone || 'N/A'}
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {lead.widget_name}
                                                </TableCell>
                                                <TableCell className="font-semibold text-gray-900">
                                                    {lead.formatted_total || formatCurrency(lead.total_price || 0)}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(lead.status)}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {lead.created_at}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={`/leads/${lead.id}`}>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Link>
                                                    </Button>
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
