import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, Calendar, Camera, GraduationCap, Loader2, Mail, MapPin, Phone, Save } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function SchoolProfile({ settings }: { settings: any }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.school_logo ? `/storage/${settings.school_logo}` : null
    );

    const { data, setData, put, processing, errors } = useForm({
        school_name: settings.school_name || '',
        school_email: settings.school_email || '',
        school_phone: settings.school_phone || '',
        school_address: settings.school_address || '',
        current_session: settings.current_session || '',
        current_term: settings.current_term || '',
        logo: null as File | null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // We use POST instead of PUT because HTML forms can't directly upload files via PUT cleanly in Inertia without _method mapping
        put(route('school-profile.update'), {
            preserveScroll: true,
            onSuccess: () => toast.success('School configuration saved successfully!'),
        });
    };

    return (
        <AppLayout>
            <Head title="School Profile Settings" />

            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">School Profile</h1>
                    <p className="text-muted-foreground text-sm">Manage your institution's core identity and academic calendar settings.</p>
                </div>

                <form onSubmit={submit}>
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="general" className="gap-2">
                                <Building2 className="h-4 w-4" /> General Info
                            </TabsTrigger>
                            <TabsTrigger value="academic" className="gap-2">
                                <GraduationCap className="h-4 w-4" /> Academic Settings
                            </TabsTrigger>
                        </TabsList>

                        {/* GENERAL SETTINGS TAB */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Institution Identity</CardTitle>
                                    <CardDescription>This information will appear on report cards, receipts, and login screens.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    
                                    {/* Logo Upload Section */}
                                    <div className="flex flex-col md:flex-row gap-6 items-center p-4 border rounded-lg bg-muted/20">
                                        <div 
                                            className="h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center bg-background overflow-hidden relative group cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="School Logo" className="h-full w-full object-cover" />
                                            ) : (
                                                <Building2 className="h-8 w-8 text-muted-foreground/50" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="text-sm font-semibold">School Logo</h4>
                                            <p className="text-xs text-muted-foreground mt-1 mb-3">Recommended size: 256x256px. PNG, JPG or SVG.</p>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleLogoChange} 
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                Change Logo
                                            </Button>
                                            {errors.logo && <p className="text-destructive text-xs mt-2">{errors.logo}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Registered School Name</Label>
                                            <Input 
                                                value={data.school_name} 
                                                onChange={e => setData('school_name', e.target.value)} 
                                            />
                                            {errors.school_name && <p className="text-destructive text-xs">{errors.school_name}</p>}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label>Official Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    className="pl-9" 
                                                    type="email" 
                                                    value={data.school_email} 
                                                    onChange={e => setData('school_email', e.target.value)} 
                                                />
                                            </div>
                                            {errors.school_email && <p className="text-destructive text-xs">{errors.school_email}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Contact Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    className="pl-9" 
                                                    value={data.school_phone} 
                                                    onChange={e => setData('school_phone', e.target.value)} 
                                                />
                                            </div>
                                            {errors.school_phone && <p className="text-destructive text-xs">{errors.school_phone}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Physical Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Textarea 
                                                    className="pl-9 resize-none" 
                                                    rows={3} 
                                                    value={data.school_address} 
                                                    onChange={e => setData('school_address', e.target.value)} 
                                                />
                                            </div>
                                            {errors.school_address && <p className="text-destructive text-xs">{errors.school_address}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ACADEMIC SETTINGS TAB */}
                        <TabsContent value="academic" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Academic Calendar Context</CardTitle>
                                    <CardDescription>
                                        Update these values when you roll over to a new term or school year. 
                                        This affects attendance, grading, and fee generation system-wide.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" /> Current Academic Session
                                            </Label>
                                            <Select value={data.current_session} onValueChange={v => setData('current_session', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Session" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                                    <SelectItem value="2026/2027">2026/2027</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.current_session && <p className="text-destructive text-xs">{errors.current_session}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4" /> Current Term / Semester
                                            </Label>
                                            <Select value={data.current_term} onValueChange={v => setData('current_term', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Term" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="First Term">First Term</SelectItem>
                                                    <SelectItem value="Second Term">Second Term</SelectItem>
                                                    <SelectItem value="Third Term">Third Term</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.current_term && <p className="text-destructive text-xs">{errors.current_term}</p>}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md text-sm text-amber-800 dark:text-amber-300">
                                        <strong>Heads up!</strong> Changing the active term will switch the default context for all teachers submitting exam marks. Ensure the previous term's grading is fully completed before changing this.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <div className="flex justify-end pt-6">
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </div>
        </AppLayout>
    );
}