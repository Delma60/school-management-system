import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Classroom } from '@/types';
import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroom: Classroom | null;
    selectedDate?: string; // Added to sync with the parent page's date
}

export function TakeAttendanceSheet({ open, onOpenChange, classroom, selectedDate }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const activeDate = selectedDate || today;

    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        classroom_id: '',
        date: activeDate,
        data: {} as Record<string, string>,
    });

    // Smart Initialization: Pre-fill with existing data if it exists, otherwise default to present
    useEffect(() => {
        if (classroom && open) {
            const initialAttendance: Record<string, string> = {};

            classroom.students?.forEach((student) => {
                // Check both singular and plural depending on how your backend relationship is named
                const existingRecord = student.attendance?.[0] || student.attendances?.[0];
                
                // If they already have a status for this day, use it. Otherwise, assume present.
                initialAttendance[student.id.toString()] = existingRecord?.status || 'present';
            });

            setData({
                classroom_id: classroom.id.toString(),
                date: activeDate,
                data: initialAttendance,
            });
            
            // Reset search when opening
            setSearchQuery('');
        }
    }, [classroom, open, activeDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('attendances.store'), {
            onSuccess: () => {
                toast.success('Attendance recorded successfully!');
                onOpenChange(false);
            },
            onError: () => toast.error('Failed to record attendance.'),
            onFinish: () => reset(),
        });
    };

    const setStudentStatus = (studentId: string, status: string) => {
        if (!status) return; 
        setData('data', { ...data.data, [studentId]: status });
    };

    // Filter students by search
    const filteredStudents = classroom?.students?.filter((student) => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (student.meta?.admission_number && student.meta.admission_number.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    // Bulk actions
    const markAll = (status: 'present' | 'absent' | 'late') => {
        const newData = { ...data.data };
        filteredStudents.forEach(student => {
            newData[student.id.toString()] = status;
        });
        setData('data', newData);
    };

    const hasStudents = classroom?.students && classroom.students.length > 0;

    return (
        <Sheet
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) reset();
            }}
        >
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <SheetHeader className="pb-2">
                        <SheetTitle>Daily Attendance</SheetTitle>
                        <SheetDescription>
                            {classroom?.name} • Mark statuses for {new Date(activeDate).toLocaleDateString()}.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 py-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-8 bg-muted/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Bulk Actions */}
                        {hasStudents && (
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs text-muted-foreground font-medium">
                                    {filteredStudents.length} students
                                </span>
                                <div className="flex gap-2">
                                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-green-600 bg-green-50 hover:bg-green-100" onClick={() => markAll('present')}>
                                        All Present
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-600 bg-red-50 hover:bg-red-100" onClick={() => markAll('absent')}>
                                        All Absent
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Student List */}
                    <ScrollArea className="border-border flex-1 rounded-md border">
                        <div className="flex flex-col divide-y">
                            {hasStudents ? (
                                filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <div key={student.id} className="hover:bg-muted/50 flex items-center justify-between p-3 sm:p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                        {student.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex max-w-[120px] flex-col sm:max-w-[180px]">
                                                    <span className="truncate text-sm leading-none font-medium" title={student.name}>
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
                                                <ToggleGroupItem
                                                    value="present"
                                                    className="h-8 px-2 text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-800"
                                                >
                                                    P
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value="late"
                                                    className="h-8 px-2 text-xs data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-800"
                                                >
                                                    L
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value="absent"
                                                    className="h-8 px-2 text-xs data-[state=on]:bg-red-100 data-[state=on]:text-red-800"
                                                >
                                                    A
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center text-sm">
                                        No students match your search.
                                    </div>
                                )
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