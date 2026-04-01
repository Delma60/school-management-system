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
import { Head, useForm } from '@inertiajs/react';
import { CalendarCheck, CalendarOff, CheckCircle, Clock, FileText, Plus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LeaveRequest {
    id: number;
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_remark?: string;
    created_at: string;
}

interface Props {
    leaveRequests: LeaveRequest[];
}

export default function LeaveRequestsIndex({ leaveRequests = [] }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Calculate quick stats
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(req => req.status === 'pending').length;
    const approved = leaveRequests.filter(req => req.status === 'approved').length;
    const rejected = leaveRequests.filter(req => req.status === 'rejected').length;

    const { data, setData, post, processing, reset, errors } = useForm({
        type: '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('leave-requests.store'), {
            onSuccess: () => {
                // toast.success('Leave request submitted successfully.');
                setIsCreateOpen(false);
                reset();
            },
            onError: () => toast.error('Please check the form for errors.'),
        });
    };

    // Helper for status badges
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
            case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
            default: return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Leave Requests', href: '#' }]}>
            <Head title="Leave Requests" />
            
            <div className="space-y-6 p-6">
                
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <CalendarOff className="text-primary h-6 w-6" /> My Leave Requests
                        </h1>
                        <p className="text-muted-foreground text-sm">Apply for time off and track your approval status.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> New Leave Request
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <Card className="shadow-sm border-t-4 border-t-primary">
                        <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Total Applications</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-t-4 border-t-amber-400">
                        <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Pending Review</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-amber-600">{pending}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-t-4 border-t-green-500">
                        <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Approved</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-green-600">{approved}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-t-4 border-t-destructive">
                        <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground uppercase">Rejected</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-destructive">{rejected}</div></CardContent>
                    </Card>
                </div>

                {/* Leave History Table */}
                <Card className="shadow-sm border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Admin Remark</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium capitalize">{req.type.replace('_', ' ')}</TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={req.reason}>
                                                {req.reason}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(req.status)}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground italic max-w-[150px] truncate">
                                                {req.admin_remark || '--'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="h-8 w-8 mb-2 opacity-20" />
                                                <p>You haven't submitted any leave requests yet.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Create Application Form (Sheet) */}
                <Sheet open={isCreateOpen} onOpenChange={(val) => { setIsCreateOpen(val); if (!val) reset(); }}>
                    <SheetContent className="sm:max-w-md overflow-y-auto">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-6">
                            <SheetHeader>
                                <SheetTitle>Apply for Leave</SheetTitle>
                                <SheetDescription>Submit a formal request for time off. Note that requests are subject to admin approval.</SheetDescription>
                            </SheetHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Leave Type <span className="text-destructive">*</span></Label>
                                    <Select value={data.type} onValueChange={val => setData('type', val)}>
                                        <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sick_leave">Sick Leave</SelectItem>
                                            <SelectItem value="casual_leave">Casual Leave</SelectItem>
                                            <SelectItem value="maternity_leave">Maternity Leave</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date <span className="text-destructive">*</span></Label>
                                        <Input type="date" className="bg-muted/50" value={data.start_date} min={new Date().toISOString().split('T')[0]} onChange={e => setData('start_date', e.target.value)} />
                                        {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date <span className="text-destructive">*</span></Label>
                                        <Input type="date" className="bg-muted/50" value={data.end_date} min={data.start_date || new Date().toISOString().split('T')[0]} onChange={e => setData('end_date', e.target.value)} />
                                        {errors.end_date && <p className="text-xs text-destructive">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Reason for Leave <span className="text-destructive">*</span></Label>
                                    <Textarea 
                                        rows={4} 
                                        placeholder="Please provide details about why you need this time off..." 
                                        value={data.reason} 
                                        onChange={e => setData('reason', e.target.value)} 
                                    />
                                    {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
                                </div>
                            </div>

                            <SheetFooter className="mt-4 border-t pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}