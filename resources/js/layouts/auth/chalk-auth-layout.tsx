import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { type PropsWithChildren } from 'react';

interface ChalkAuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function ChalkAuthLayout({ children, title, description }: PropsWithChildren<ChalkAuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Main auth card */}
                <div className="glass rounded-2xl shadow-2xl border border-white/20 p-8 backdrop-blur-xl bg-white/90">
                    {/* Logo and branding */}
                    <div className="text-center mb-8">
                        <Link href={route('home')} className="inline-block">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 bg-gradient-chalk rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                            >
                                <svg
                                    className="w-10 h-10 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                    <path d="M2 17L12 22L22 17"/>
                                    <path d="M2 12L12 17L22 12"/>
                                </svg>
                            </motion.div>
                        </Link>
                        
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            <span className="text-gradient-chalk">Chalk</span>
                        </h1>
                        
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
                        <p className="text-gray-600 text-sm">{description}</p>
                    </div>

                    {/* Form content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>

                {/* Footer text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center mt-8 text-sm text-gray-500"
                >
                    © 2024 Chalk. Lead conversion made simple.
                </motion.div>
            </motion.div>
        </div>
    );
}