import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Edit2, Plus, Settings2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function GradingScale({ scales }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        delete: _del,
    } = useForm({
        id: null as number | null,
        grade: '',
        min_score: '',
        max_score: '',
        remark: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.id) {
            put(route('grades.update', data.id), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Grading Scale updated');
                },
            });
        } else {
            post(route('grades.store'), {
                onSuccess: () => {
                    closeModal();
                    toast.success('Grading Scale created');
                },
            });
        }
    };

    const handleDelete = () => {
        _del(route('grades.destory', data.id), {
            onSuccess: () => {},
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    return (
        <AppLayout>
            <Head title="Grading Scale" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Grading Scale</h1>
                        <p className="text-muted-foreground text-sm">Manage how scores are converted to letter grades.</p>
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Add Grade Level
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={submit}>
                                <DialogHeader>
                                    <DialogTitle>{data.id ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
                                    <DialogDescription>Define the range and remark for this grade level.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Grade</Label>
                                        <Input
                                            className="col-span-3"
                                            placeholder="A1, B2, etc."
                                            value={data.grade}
                                            onChange={(e) => setData('grade', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Min %</Label>
                                        <Input
                                            type="number"
                                            className="col-span-3"
                                            value={data.min_score}
                                            onChange={(e) => setData('min_score', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Max %</Label>
                                        <Input
                                            type="number"
                                            className="col-span-3"
                                            value={data.max_score}
                                            onChange={(e) => setData('max_score', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Remark</Label>
                                        <Input
                                            className="col-span-3"
                                            placeholder="Excellent"
                                            value={data.remark}
                                            onChange={(e) => setData('remark', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Settings2 className="text-muted-foreground h-5 w-5" />
                            Active Grading System
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[100px]">Grade</TableHead>
                                    <TableHead>Score Range</TableHead>
                                    <TableHead>Remark</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scales.map((scale: any) => (
                                    <TableRow key={scale.id}>
                                        <TableCell className="text-lg font-bold">{scale.grade}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{scale.min_score}%</Badge>
                                                <span className="text-muted-foreground">—</span>
                                                <Badge variant="outline">{scale.max_score}%</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm italic">{scale.remark}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setData(scale);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" size="icon" className="text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <div className="">Are you sure</div>
                                                        <DialogFooter>
                                                            <Button>Confirm</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
