import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Subject, Teacher } from '@/types';
import { useForm } from '@inertiajs/react';
import { BookPlus, Loader2, Search } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface Props {
    teacher: Teacher;
    allSubjects: Subject[]; // Passed from the Controller
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AssignSubjectsModal({ teacher, allSubjects, open, onOpenChange }: Props) {
    // Initialize with currently assigned subject IDs
    const currentIds = teacher.subjects?.map((s) => s.id) || [];

    const { data, setData, post, processing } = useForm({
        subject_ids: currentIds as number[],
    });

    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredSubjects = allSubjects.filter(
        (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const toggleSubject = (id: number) => {
        const current = [...data.subject_ids];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('subject_ids', current);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('teachers.assign-subjects', teacher.id), {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Subjects assigned successfully!');
            },
            onError: () => {
                toast.error('Failed to assign subjects. Please try again.');
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BookPlus className="text-primary h-5 w-5" />
                            Assign Subjects
                        </DialogTitle>
                        <DialogDescription>Select the subjects {teacher.name} will be responsible for this term.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Search Filter */}
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search subjects by name or code..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selection Area */}
                        <ScrollArea className="h-[300px] rounded-md border p-2 pr-4">
                            <div className="space-y-3">
                                {filteredSubjects.map((subject) => (
                                    <div
                                        key={subject.id}
                                        className="hover:bg-muted/50 flex items-center justify-between space-x-2 rounded-lg p-2 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`subject-${subject.id}`}
                                                checked={data.subject_ids.includes(subject.id)}
                                                onCheckedChange={() => toggleSubject(subject.id)}
                                            />
                                            <label htmlFor={`subject-${subject.id}`} className="cursor-pointer text-sm leading-none font-medium">
                                                <span className="block">{subject.name}</span>
                                                <span className="text-muted-foreground font-mono text-[11px] uppercase">
                                                    {subject.code} • {subject.department}
                                                </span>
                                            </label>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase">
                                            {subject.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="text-muted-foreground text-xs italic">{data.subject_ids.length} subjects selected for assignment.</div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Assignments
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
