import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, Eye, Info, Monitor, ShieldAlert, User } from 'lucide-react';
import React, { useState } from 'react';

export default function SystemLogsIndex({ logs, filters }: any) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [level, setLevel] = useState(filters.level || 'all');
    
    // State for the details side-panel
    const [selectedLog, setSelectedLog] = useState<any | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Trigger backend filtering when search or select changes
    const applyFilters = (newLevel: string, newSearch: string) => {
        router.get(route('system.logs'), { level: newLevel, search: newSearch }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') applyFilters(level, searchTerm);
    };

    const viewDetails = (log: any) => {
        setSelectedLog(log);
        setIsSheetOpen(true);
    };

    const getLevelBadge = (lvl: string) => {
        switch (lvl) {
            case 'info': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200"><Info className="mr-1 w-3 h-3" /> Info</Badge>;
            case 'warning': return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200"><AlertTriangle className="mr-1 w-3 h-3" /> Warning</Badge>;
            case 'error': return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200"><ShieldAlert className="mr-1 w-3 h-3" /> Error</Badge>;
            case 'critical': return <Badge variant="destructive"><ShieldAlert className="mr-1 w-3 h-3" /> Critical</Badge>;
            default: return <Badge variant="secondary">{lvl}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="System Logs" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">System Audit Logs</h1>
                        <p className="text-muted-foreground text-sm">Monitor system activity, user actions, and errors.</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
                        <Activity className="h-4 w-4" /> Refresh Logs
                    </Button>
                </div>

                <Card>
                    <CardHeader className="p-4 md:p-6 border-b">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <CardTitle className="text-lg">Activity Trail</CardTitle>
                            <div className="flex w-full md:w-auto gap-3">
                                <Select 
                                    value={level} 
                                    onValueChange={(val) => { setLevel(val); applyFilters(val, searchTerm); }}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="All Levels" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Levels</SelectItem>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="error">Error</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Search action or message..."
                                    className="w-full md:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Timestamp</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.length > 0 ? (
                                        logs.data.map((log: any) => (
                                            <TableRow key={log.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => viewDetails(log)}>
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </TableCell>
                                                <TableCell>{getLevelBadge(log.level)}</TableCell>
                                                <TableCell className="font-medium font-mono text-xs">{log.action}</TableCell>
                                                <TableCell className="text-sm">
                                                    {log.user ? `${log.user.name}` : 'System / Guest'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                <Activity className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                                No logs found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination Footer */}
                        {logs.total > logs.per_page && (
                            <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
                                <div>
                                    Showing {logs.from} to {logs.to} of {logs.total} results
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={!logs.prev_page_url} onClick={() => router.get(logs.prev_page_url)}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" disabled={!logs.next_page_url} onClick={() => router.get(logs.next_page_url)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* LOG DETAILS SLIDE-OUT */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="sm:max-w-lg overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="flex items-center gap-2">
                                {selectedLog && getLevelBadge(selectedLog.level)} Log Details
                            </SheetTitle>
                            <SheetDescription>Comprehensive breakdown of the recorded event.</SheetDescription>
                        </SheetHeader>
                        
                        {selectedLog && (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Message</h4>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md border">
                                        {selectedLog.message}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 text-sm">
                                        <span className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4"/> Action</span>
                                        <span className="font-mono text-muted-foreground">{selectedLog.action}</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <span className="font-semibold flex items-center gap-2"><User className="h-4 w-4"/> Initiator</span>
                                        <span className="text-muted-foreground">{selectedLog.user ? selectedLog.user.name : 'System'}</span>
                                    </div>
                                    <div className="space-y-1 text-sm col-span-2">
                                        <span className="font-semibold flex items-center gap-2"><Monitor className="h-4 w-4"/> Source Details</span>
                                        <span className="text-muted-foreground block">IP: {selectedLog.ip_address || 'N/A'}</span>
                                        <span className="text-muted-foreground text-xs line-clamp-2">{selectedLog.user_agent || 'Unknown Device'}</span>
                                    </div>
                                </div>

                                {selectedLog.meta && Object.keys(selectedLog.meta).length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Metadata / JSON Payload</h4>
                                        <pre className="p-4 bg-slate-950 text-slate-50 rounded-md text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                                            {JSON.stringify(selectedLog.meta, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

            </div>
        </AppLayout>
    );
}