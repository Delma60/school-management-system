import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Bell, Building2, CreditCard, GraduationCap, Loader2, Save, Server } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function GlobalSettings({ settings }: { settings: Record<string, string> }) {
    
    // Wrap all settings inside a "settings" object for easy bulk saving
    const { data, setData, post, processing, isDirty } = useForm({
        settings: {
            // General
            school_name: settings.school_name || '',
            school_phone: settings.school_phone || '',
            contact_email: settings.contact_email || '',
            address: settings.address || '',
            // Academic
            current_session: settings.current_session || '',
            current_term: settings.current_term || '',
            grading_system: settings.grading_system || '',
            // Financial
            currency: settings.currency || 'NGN',
            payment_gateway: settings.payment_gateway || 'paystack',
            gateway_public_key: settings.gateway_public_key || '',
            tax_percentage: settings.tax_percentage || '0',
            // System
            smtp_host: settings.smtp_host || '',
            smtp_port: settings.smtp_port || '',
            maintenance_mode: settings.maintenance_mode === 'true',
        }
    });

    // Helper to update deeply nested state
    const updateSetting = (key: keyof typeof data.settings, value: string | boolean) => {
        setData('settings', { ...data.settings, [key]: value.toString() });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Settings updated successfully!'),
        });
    };

    return (
        <AppLayout>
            <Head title="System Settings" />

            <div className="p-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
                        <p className="text-muted-foreground text-sm">Manage global settings, integrations, and preferences.</p>
                    </div>
                    {isDirty && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-900">
                            Unsaved changes
                        </div>
                    )}
                </div>

                <form onSubmit={submit}>
                    {/* VERTICAL TABS LAYOUT */}
                    <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8">
                        
                        {/* LEFT SIDEBAR NAVIGATION */}
                        <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full md:w-64 space-y-1">
                            <TabsTrigger value="general" className="w-full justify-start gap-3 px-4 py-2.5 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                                <Building2 className="h-4 w-4" /> General Profile
                            </TabsTrigger>
                            <TabsTrigger value="academic" className="w-full justify-start gap-3 px-4 py-2.5 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                                <GraduationCap className="h-4 w-4" /> Academic Config
                            </TabsTrigger>
                            <TabsTrigger value="finance" className="w-full justify-start gap-3 px-4 py-2.5 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                                <CreditCard className="h-4 w-4" /> Finance & Payments
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="w-full justify-start gap-3 px-4 py-2.5 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                                <Bell className="h-4 w-4" /> Email & SMS
                            </TabsTrigger>
                            <TabsTrigger value="system" className="w-full justify-start gap-3 px-4 py-2.5 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                                <Server className="h-4 w-4" /> System Setup
                            </TabsTrigger>
                        </TabsList>

                        {/* RIGHT CONTENT AREA */}
                        <div className="flex-1 min-w-0">
                            
                            {/* GENERAL SETTINGS */}
                            <TabsContent value="general" className="m-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Institution Identity</CardTitle>
                                        <CardDescription>Core information used across reports and the portal.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Registered School Name</Label>
                                            <Input value={data.settings.school_name} onChange={e => updateSetting('school_name', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Support Email</Label>
                                                <Input type="email" value={data.settings.contact_email} onChange={e => updateSetting('contact_email', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <Input value={data.settings.school_phone} onChange={e => updateSetting('school_phone', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Physical Address</Label>
                                            <Textarea value={data.settings.address} onChange={e => updateSetting('address', e.target.value)} rows={3} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ACADEMIC SETTINGS */}
                            <TabsContent value="academic" className="m-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Academic Calendar & Grading</CardTitle>
                                        <CardDescription>Define the current operating period for the school.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Active Session</Label>
                                                <Select value={data.settings.current_session} onValueChange={v => updateSetting('current_session', v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                                                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                                                        <SelectItem value="2026/2027">2026/2027</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Active Term</Label>
                                                <Select value={data.settings.current_term} onValueChange={v => updateSetting('current_term', v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="First Term">First Term</SelectItem>
                                                        <SelectItem value="Second Term">Second Term</SelectItem>
                                                        <SelectItem value="Third Term">Third Term</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* FINANCE SETTINGS */}
                            <TabsContent value="finance" className="m-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment & Billing Integration</CardTitle>
                                        <CardDescription>Configure how parents pay fees online.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Default Currency</Label>
                                                <Select value={data.settings.currency} onValueChange={v => updateSetting('currency', v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                                                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                                                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Active Payment Gateway</Label>
                                                <Select value={data.settings.payment_gateway} onValueChange={v => updateSetting('payment_gateway', v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="paystack">Paystack</SelectItem>
                                                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                                                        <SelectItem value="stripe">Stripe</SelectItem>
                                                        <SelectItem value="manual">Manual / Bank Transfer Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {data.settings.payment_gateway !== 'manual' && (
                                            <div className="space-y-2 pt-2 border-t mt-4">
                                                <Label>Gateway Public Key</Label>
                                                <Input 
                                                    placeholder="pk_test_xxxxxxxxxxx" 
                                                    value={data.settings.gateway_public_key} 
                                                    onChange={e => updateSetting('gateway_public_key', e.target.value)} 
                                                />
                                                <p className="text-xs text-muted-foreground">This key is safe to expose to the frontend for initiating payments.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* SYSTEM SETTINGS */}
                            <TabsContent value="system" className="m-0 space-y-6">
                                <Card className="border-red-100 dark:border-red-900/30">
                                    <CardHeader>
                                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                        <CardDescription>Advanced system configurations.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Maintenance Mode</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Prevent students and teachers from logging in. Admins will still have access.
                                                </p>
                                            </div>
                                            <Switch 
                                                checked={data.settings.maintenance_mode} 
                                                onCheckedChange={v => updateSetting('maintenance_mode', v)} 
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* GLOBAL SAVE BUTTON */}
                            <div className="flex justify-end mt-8 border-t pt-6">
                                <Button type="submit" disabled={processing || !isDirty} className="gap-2 px-8">
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Configuration
                                </Button>
                            </div>

                        </div>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}