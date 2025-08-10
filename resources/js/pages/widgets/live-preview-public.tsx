import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import EstimateTestDrawer from '@/components/EstimateTestDrawer';

interface LivePreviewPublicProps {
    widget: {
        id: number;
        name: string;
        widget_key: string;
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
}

export default function LivePreviewPublic({ widget }: LivePreviewPublicProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    return (
        <>
            <Head title={`${widget.company_name} - Get Quote`} />
            
            {/* Full Screen Widget for iframe embedding */}
            <EstimateTestDrawer
                isOpen={true}
                onClose={() => {}} // No close functionality in public view
                widget={widget}
                fullScreen={true}
            />
        </>
    );
}