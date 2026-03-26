import { CreateTeacherSheet } from '@/components/create-student-sheet copy';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Teacher } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Filter, Mail, MoreVertical, Phone, Search, UserPlus, Users } from 'lucide-react';
import React, { useState } from 'react';

// TODO:: Audit LOg to track which admin asign subject to teacher

interface Props {
    teachers:Teacher[];
    filters:any
}
export default function TeachersIndex({ teachers, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            route('teachers.index'),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="Teachers Directory" />

                {/* Header & Primary Action */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Faculty Directory</h1>
                        <p className="text-muted-foreground">Manage and monitor all teaching staff across departments.</p>
                    </div>
                    <Button className="gap-2" onClick={() => setIsModalOpen(!isModalOpen)}>
                        <UserPlus className="h-4 w-4" /> Add New Teacher
                    </Button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-card flex flex-col items-center gap-4 rounded-xl border p-4 shadow-sm md:flex-row">
                    <div className="relative w-full flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search by name, email, or department..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex w-full gap-2 md:w-auto">
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </Button>
                    </div>
                </div>

                {/* Teachers Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {teachers.data.map((teacher: any) => (
                        <Card key={teacher.id} className="group overflow-hidden transition-shadow hover:shadow-md">
                            <CardContent className="pt-6 text-center">
                                <div className="relative inline-block">
                                    <Avatar className="border-background mx-auto h-20 w-20 border-2 shadow-sm transition-transform group-hover:scale-105">
                                        <AvatarImage src={teacher.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                            {teacher.name
                                                .split(' ')
                                                .map((n: any) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span
                                        className="border-background absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 bg-green-500"
                                        title="Active"
                                    />
                                </div>

                                <h3 className="mt-4 text-lg leading-tight font-bold">{teacher.name}</h3>
                                <p className="text-muted-foreground text-sm font-medium tracking-tighter uppercase">
                                    {teacher.meta?.department || 'General Faculty'}
                                </p>

                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <Badge variant="secondary" className="gap-1 font-normal">
                                        <BookOpen className="h-3 w-3" /> {teacher.subjects_count || 0} Subjects
                                    </Badge>
                                    <Badge variant="outline" className="gap-1 font-normal">
                                        {teacher.meta?.designation || 'Lecturer'}
                                    </Badge>
                                </div>
                            </CardContent>

                            <Separator />

                            <CardFooter className="bg-muted/30 flex items-center justify-between p-2">
                                <div className="flex">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={route('teachers.show', teacher.id)}>
                                        <Button variant="link" size="sm" className="h-8 px-2 text-xs">
                                            View Profile
                                        </Button>
                                    </Link>
                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem>Assign Subject</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {teachers.data.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed py-20 text-center">
                        <Users className="text-muted-foreground/50 mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No teachers found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
            <CreateTeacherSheet open={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)} />
        </AppLayout>
    );
}
