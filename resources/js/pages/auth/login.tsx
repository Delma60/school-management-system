import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Loader2, Lock, Mail } from 'lucide-react';
import React, { FormEventHandler } from 'react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
            <Head title="Log in" />

            {/* LEFT COLUMN: The Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 xl:p-32 relative">

                {/* Mobile/Tablet Logo (Hidden on Large Desktop) */}
                <div className="flex items-center gap-2 mb-12 lg:hidden text-primary">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Delma Portal</span>
                </div>

                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access the school management system.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 font-medium text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-md border border-emerald-200 dark:border-emerald-800">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-10"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@delmaschool.com"
                                    autoFocus
                                />
                            </div>
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="pl-10"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground">
                                Keep me logged in
                            </Label>
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Delma International School. All rights reserved.</p>
                        <p className="mt-1">Powered by School Management System</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Branding / Image Showcase */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
                {/* Add a beautiful photo from your school here. If you don't have one, this uses an abstract gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-slate-900 z-10 mix-blend-multiply" />

                {/* Replace this URL with an actual photo of your school from public/images/ */}
                <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                    alt="School Campus"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Delma International</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                                Empowering the next generation of leaders.
                            </h2>
                            <p className="text-lg text-slate-300">
                                Access your personalized dashboard to manage classes, grades, finances, and student records seamlessly.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-300 border-t border-white/20 pt-6">
                            <div className="flex -space-x-3">
                                {/* Decorative avatars */}
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="avatar" className="h-full w-full rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by over <strong>1,200+</strong> students and staff.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
