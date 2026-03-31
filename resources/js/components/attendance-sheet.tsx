import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Classroom } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroom: Classroom | null;
}

export function TakeAttendanceSheet({ open, onOpenChange, classroom }: Props) {
    // We default the date to today (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, reset } = useForm({
        classroom_id: '',
        date: today,
        data: {} as Record<string, string>, // { "student_id": "status" }
    });

    // When the sheet opens, automatically set everyone to 'present' to save time
    useEffect(() => {
        if (classroom && open) {
            const initialAttendance: Record<string, string> = {};
            
            classroom.students?.forEach((student) => {
                initialAttendance[student.id.toString()] = 'present';
            });

            setData({
                classroom_id: classroom.id.toString(),
                date: today,
                data: initialAttendance,
            });
        }
    }, [classroom, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Assuming your standard route is named 'attendances.store'
        post(route('attendances.store'), {
            onSuccess: () => {
                toast.success('Attendance recorded successfully!');
                onOpenChange(false);
            },
            onError: () => toast.error('Failed to record attendance.'),
            onFinish: () => reset(),
        });
    };

    // Helper to update a specific student's status
    const setStudentStatus = (studentId: string, status: string) => {
        if (!status) return; // Prevent deselecting (ToggleGroup behavior)
        setData('data', { ...data.data, [studentId]: status });
    };

    const hasStudents = classroom?.students && classroom.students.length > 0;

    return (
        <Sheet open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) reset();
        }}>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <SheetHeader className="pb-4">
                        <SheetTitle>Daily Attendance</SheetTitle>
                        <SheetDescription>
                            {classroom?.name} • Select a date and mark student statuses.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Date Picker */}
                    <div className="mb-6 grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.date}
                            max={today} // Prevent taking attendance in the future
                            onChange={(e) => setData('date', e.target.value)}
                        />
                    </div>

                    {/* Scrollable Student List */}
                    <ScrollArea className="border-border flex-1 rounded-md border">
                        <div className="flex flex-col divide-y">
                            {hasStudents ? (
                                classroom.students?.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col max-w-[120px] sm:max-w-[180px]">
                                                <span className="text-sm font-medium leading-none truncate" title={student.name}>
                                                    {student.name}
                                                </span>
                                            </div>
                                        </div>

                                        <ToggleGroup 
                                            type="single" 
                                            value={data.data[student.id.toString()]} 
                                            onValueChange={(val) => setStudentStatus(student.id.toString(), val)}
                                            className="justify-end gap-1"
                                        >
                                            <ToggleGroupItem value="present" className="h-8 px-2 text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
                                                P
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="late" className="h-8 px-2 text-xs data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800">
                                                L
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="absent" className="h-8 px-2 text-xs data-[state=on]:bg-red-100 data-[state=on]:text-red-800">
                                                A
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted-foreground py-8 text-center text-sm">
                                    No students enrolled in this class.
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <SheetFooter className="pt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !hasStudents}>
                            {processing ? 'Saving...' : 'Save Attendance'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}