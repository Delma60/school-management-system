import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function AttendanceTab({ attendanceData, attendanceStats }: { attendanceStats: Record<string, string>; attendanceData: any[] }) {
    // Logic to generate a 30-day grid for the current month
    const daysInMonth = new Date(2026, 3, 0).getDate(); // Example for March
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'bg-green-500';
            case 'absent':
                return 'bg-destructive';
            case 'late':
                return 'bg-orange-400';
            case 'excused':
                return 'bg-blue-400';
            default:
                return 'bg-muted';
        }
    };

    return (
        <div className="space-y-6">
            {/* Attendance Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Present</p>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.present || 0}</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Late</p>
                    <p className="text-2xl font-bold text-orange-500">{attendanceStats.late}</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Absent</p>
                    <p className="text-destructive text-2xl font-bold">{attendanceStats.absent}</p>
                </div>
                <div className="bg-card rounded-xl border p-4 text-center">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Excused</p>
                    <p className="text-2xl font-bold text-blue-500">{attendanceStats.excused}</p>
                </div>
            </div>

            {/* Monthly Heatmap Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm font-semibold">
                        Attendance Heatmap — March 2026
                        <div className="flex gap-4 text-[10px] font-normal uppercase">
                            <span className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-green-500" /> Present
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="bg-destructive h-2 w-2 rounded-full" /> Absent
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-orange-400" /> Late
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-15">
                        <TooltipProvider>
                            {days.map((day, i) => {
                                const record = attendanceData.find((att) => {
                                    const recordDate = new Date(att.date);
                                    // Check if the day of the month matches the current loop index
                                    return recordDate.getDate() === day;
                                });

                                // 2. Fallback to 'null' if no record exists (e.g., weekends or future dates)
                                const status = record?.status || 'none';

                                return (
                                    <Tooltip key={day}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`flex h-8 w-8 cursor-help items-center justify-center rounded-md text-[10px] font-bold text-white transition-all hover:scale-110 ${getStatusColor(status)}`}
                                            >
                                                {day}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                March {day}, 2026: <span className="font-bold capitalize">{status}</span>
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </TooltipProvider>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Log List */}
            <div className="bg-card overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-sm font-medium">March 18, 2026</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="border-orange-200 text-orange-600">
                                    Late (15 mins)
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs italic">Traffic delay reported by parent.</TableCell>
                        </TableRow>
                        {/* ... more rows ... */}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
