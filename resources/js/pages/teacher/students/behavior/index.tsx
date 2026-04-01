import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Activity, AlertTriangle, CheckCircle, Info, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BehaviorLogIndex({ logs, filters, students, stats }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        student_id: '',
        type: 'infraction',
        title: '',
        description: '',
        incident_date: new Date().toISOString().split('T')[0],
        action_taken: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('behavior-logs.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleFilterChange('search', search);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('behavior-logs.store'), {
            onSuccess: () => {
                toast.success('Log added successfully!');
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Behavior Logs', href: '#' }]}>
            <Head title="Behavior Logs" />
            <div className="space-y-6 p-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Activity className="text-primary h-6 w-6" /> Student Behavior Logs
                        </h1>
                        <p className="text-muted-foreground text-sm">Track disciplinary actions and positive remarks.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> Record Incident
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card className="border-t-4 border-t-primary">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Logs</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.total_logs}</div></CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-green-500">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Positive Remarks</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-green-600">{stats.positive}</div></CardContent>
                    </Card>
                    <Card className="border-t-4 border-t-destructive">
                        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Infractions</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-destructive">{stats.infractions}</div></CardContent>
                    </Card>
                </div>

                {/* Filters & Table */}
                <Card className="shadow-sm border">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b bg-muted/10">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search student name..." className="pl-8 bg-background" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch} />
                        </div>
                        <Select value={filters.type || 'all'} onValueChange={v => handleFilterChange('type', v === 'all' ? '' : v)}>
                            <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="positive">Positive</SelectItem>
                                <SelectItem value="infraction">Infraction</SelectItem>
                                <SelectItem value="neutral">Neutral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Incident</TableHead>
                                <TableHead>Reported By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.map((log: any) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{log.student?.name.substring(0,2)}</AvatarFallback></Avatar>
                                            {log.student?.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(log.incident_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {log.type === 'positive' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1"/> Positive</Badge>}
                                        {log.type === 'infraction' && <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1"/> Infraction</Badge>}
                                        {log.type === 'neutral' && <Badge variant="outline"><Info className="w-3 h-3 mr-1"/> Neutral</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-semibold text-sm">{log.title}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{log.description}</p>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{log.reporter?.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Create Log Sheet */}
                <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                            <SheetHeader>
                                <SheetTitle>Record Behavior Incident</SheetTitle>
                                <SheetDescription>Log a positive remark or disciplinary infraction.</SheetDescription>
                            </SheetHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Student <span className="text-destructive">*</span></Label>
                                    <Select onValueChange={v => setData('student_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
                                        <SelectContent>
                                            {students.map((s: any) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.student_id && <p className="text-xs text-destructive">{errors.student_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Log Type <span className="text-destructive">*</span></Label>
                                        <Select value={data.type} onValueChange={v => setData('type', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="infraction">Infraction</SelectItem>
                                                <SelectItem value="positive">Positive Remark</SelectItem>
                                                <SelectItem value="neutral">Neutral Incident</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date <span className="text-destructive">*</span></Label>
                                        <Input type="date" value={data.incident_date} onChange={e => setData('incident_date', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Title / Short Summary <span className="text-destructive">*</span></Label>
                                    <Input placeholder="e.g., Skipped class, Helped clean up..." value={data.title} onChange={e => setData('title', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Detailed Description <span className="text-destructive">*</span></Label>
                                    <Textarea rows={3} value={data.description} onChange={e => setData('description', e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Action Taken (Optional)</Label>
                                    <Input placeholder="e.g., Verbal warning given, Sent to Principal..." value={data.action_taken} onChange={e => setData('action_taken', e.target.value)} />
                                </div>
                            </div>

                            <SheetFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>Save Record</Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}