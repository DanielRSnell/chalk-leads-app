import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LoaderCircle, Mail, Lock, User, Building2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChalkAuthLayout from '@/layouts/auth/chalk-auth-layout';

type RegisterForm = {
    name: string;
    company_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ChalkRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        company_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <ChalkAuthLayout 
            title="Start your free trial" 
            description="Create your account and build high-converting lead widgets in minutes"
        >
            <Head title="Start Free Trial - Chalk" />

            <form onSubmit={submit} className="space-y-6">
                {/* Name field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter your full name"
                            className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                        />
                    </div>
                    <InputError message={errors.name} />
                </motion.div>

                {/* Company name field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                >
                    <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                        Company name
                    </Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="company_name"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="organization"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            placeholder="Your company name"
                            className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                        />
                    </div>
                    <InputError message={errors.company_name} />
                </motion.div>

                {/* Email field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Work email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={3}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter your work email"
                            className="pl-11 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                        />
                    </div>
                    <InputError message={errors.email} />
                </motion.div>

                {/* Password field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                >
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Create a strong password"
                            className="pl-11 pr-11 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <InputError message={errors.password} />
                </motion.div>

                {/* Confirm Password field */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                        Confirm password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="password_confirmation"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm your password"
                            className="pl-11 pr-11 h-12 border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} />
                </motion.div>

                {/* Submit button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button 
                        type="submit" 
                        className="w-full btn-chalk-gradient h-12 text-base font-semibold"
                        tabIndex={6} 
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                Creating account...
                            </>
                        ) : (
                            'Start free trial'
                        )}
                    </Button>
                </motion.div>

                {/* Terms text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-center text-xs text-gray-500"
                >
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                </motion.div>

                {/* Sign in link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center pt-4"
                >
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <TextLink 
                            href={route('login')} 
                            className="font-semibold text-primary hover:text-primary/80"
                            tabIndex={7}
                        >
                            Sign in
                        </TextLink>
                    </p>
                </motion.div>
            </form>
        </ChalkAuthLayout>
    );
}