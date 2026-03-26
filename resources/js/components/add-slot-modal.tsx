import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Break, Subject, Teacher } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertCircle, CalendarPlus, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

// Helper function to calculate end time (next hour)
function getNextHourTime(time: string): string {
    const [hours] = time.split(':');
    const nextHour = (parseInt(hours) + 1).toString().padStart(2, '0');
    return `${nextHour}:00`;
}

export function AddSlotModal({
    open,
    onOpenChange,
    classroomId,
    subjects,
    teachers,
    breaks,
    prefilledDay,
    prefilledTime,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroomId: number;
    subjects: Subject[];
    teachers: Teacher[];
    breaks: Break[];
    prefilledDay?: string;
    prefilledTime?: string;
}) {
    const [entryType, setEntryType] = useState<'class' | 'break'>('class');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        classroom_id: classroomId,
        subject_id: '',
        teacher_id: '',
        timebreak_id: '',
        day_of_week: prefilledDay || 'Monday',
        start_time: prefilledTime || '08:00',
        end_time: prefilledTime ? getNextHourTime(prefilledTime) : '09:00',
        entry_type: "class",
    });

    // Update form data when prefilled values change
    useEffect(() => {
        if (prefilledDay) {
            setData('day_of_week', prefilledDay);
        }
        if (prefilledTime) {
            setData('start_time', prefilledTime);
            setData('end_time', getNextHourTime(prefilledTime));
        }
    }, [prefilledDay, prefilledTime]);

    // Handle entry type change
    const handleEntryTypeChange = (type: 'class' | 'break') => {
    setEntryType(type);
    setData((prevData) => ({
        ...prevData,
        entry_type: type,
        // Reset fields that don't belong to the new type
        subject_id: type === 'break' ? '' : prevData.subject_id,
        teacher_id: type === 'break' ? '' : prevData.teacher_id,
        timebreak_id: type === 'class' ? '' : prevData.timebreak_id,
    }));
};

    // Close and clean up
    const handleClose = (isOpen: boolean) => {
        if (!isOpen) {
            reset('subject_id', 'teacher_id');
            clearErrors();
        }
        onOpenChange(isOpen);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure classroom ID is strictly tied to the current view
        setData('classroom_id', classroomId);
        setData('entry_type', entryType);

        post(route('timetables.store'), {
            onSuccess: () => {
                handleClose(false);
                toast.success('Timetable slot added successfully!');
            },
            onError: () => {
                toast.error('Failed to add slot. Please check the form for errors.');
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarPlus className="text-primary h-5 w-5" />
                            Add Timetable Slot
                        </DialogTitle>
                        <DialogDescription>
                            Schedule a class block. The system will automatically check for teacher and room conflicts.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Global Error Alert (for Overlaps) */}
                        {(errors.start_time || errors.teacher_id) && (
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="ml-2 text-xs font-medium">{errors.start_time || errors.teacher_id}</AlertDescription>
                            </Alert>
                        )}

                        {/* Entry Type Toggle */}
                        <div className="space-y-2">
                            <Label>Slot Type</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={entryType === 'class' ? 'default' : 'outline'}
                                    onClick={() => handleEntryTypeChange('class')}
                                    className="flex-1"
                                >
                                    Class
                                </Button>
                                <Button
                                    type="button"
                                    variant={entryType === 'break' ? 'default' : 'outline'}
                                    onClick={() => handleEntryTypeChange('break')}
                                    className="flex-1"
                                >
                                    Break / Event
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Day of Week</Label>
                                <Select value={data.day_of_week} onValueChange={(v) => setData('day_of_week', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Select value={data.start_time} onValueChange={(v) => setData('start_time', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_SLOTS.slice(0, -1).map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Select value={data.end_time} onValueChange={(v) => setData('end_time', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_SLOTS.slice(1).map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Conditional fields based on entry type */}
                        {entryType === 'class' ? (
                            <>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={data.subject_id} onValueChange={(v) => setData('subject_id', v)}>
                                        <SelectTrigger className={errors.subject_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.id.toString()}>
                                                    {sub.name} ({sub.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Assigned Teacher</Label>
                                    <Select value={data.teacher_id} onValueChange={(v) => setData('teacher_id', v)}>
                                        <SelectTrigger className={errors.teacher_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select Teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Label>Break / Event Type</Label>
                                <Select value={data.timebreak_id} onValueChange={(v) => setData('timebreak_id', v)}>
                                    <SelectTrigger className={errors.timebreak_id ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select Break or Event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {breaks?.map((brk) => (
                                            <SelectItem key={brk.id} value={brk.id.toString()}>
                                                {brk.name} ({brk.type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Schedule
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
