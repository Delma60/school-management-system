import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCheck, ShieldCheck, Briefcase, Search, Filter, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';

export default function NonAcademicStaff({ staff, roles, filters, stats }: any) {

    const updateFilter = (key: string, value: string) => {
        router.get(
            '/dashboard/staff/others',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        router.get('/dashboard/staff/others');
    };

    // Helper to get initials for avatar fallback
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <AppLayout>
            <Head title="Non-Academic Staff" />

            <div className="p-6 space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Non-Academic Staff</h1>
                        <p className="text-sm text-muted-foreground">Manage administrative, support, and maintenance personnel.</p>
                    </div>
                    <Button className="gap-2" onClick={() => router.get(route("staff.create", { type: "non-academics" }))}>
                        <Plus className="h-4 w-4" /> Add Staff Member
                    </Button>
                </div>

                {/* --- KPI STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                            <UserCheck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active personnel</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.admin_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">System & School Admins</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Support & Operations</CardTitle>
                            <Briefcase className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.support_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">Clerks, Security, Janitorial</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- FILTERS & DATA TABLE --- */}
                <Card>
                    <CardHeader className="border-b pb-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Filter className="h-5 w-5 text-muted-foreground" />
                                Staff Directory
                            </CardTitle>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search name or email..."
                                        className="pl-9"
                                        defaultValue={filters.search}
                                        onBlur={(e) => updateFilter('search', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', e.currentTarget.value)}
                                    />
                                </div>
                                <Select value={filters.role_id || ""} onValueChange={(v) => updateFilter('role_id', v)}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        {roles.map((role: any) => (
                                            <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(filters.role_id || filters.search) && (
                                    <Button variant="ghost" onClick={clearFilters} className="text-destructive px-2 sm:px-4">Clear</Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="pl-6">Staff Member</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Department / Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No staff members found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    staff.data.map((person: any) => (
                                        <TableRow key={person.id} className="hover:bg-muted/5">
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={person.avatar} alt={person.name} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                                            {getInitials(person.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-sm">{person.name}</div>
                                                        <div className="text-xs text-muted-foreground">ID: STF-{person.id.toString().padStart(4, '0')}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <span className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="h-3 w-3" /> {person.email}
                                                    </span>
                                                    {person.meta?.phone && (
                                                        <span className="flex items-center gap-2 text-muted-foreground">
                                                            <Phone className="h-3 w-3" /> {person.meta.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal capitalize">
                                                    {person.role?.name || 'Unassigned'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {/* Assuming meta.status exists, defaulting to Active */}
                                                <Badge variant={person.meta?.status === 'inactive' ? 'destructive' : 'default'} className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                                    {person.meta?.status === 'inactive' ? 'Inactive' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.get(route("staff.show", person))}>
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.get(`/dashboard/staff/${person.id}/edit`)}>
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            Suspend Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {staff.links && staff.links.length > 3 && (
                    <div className="flex justify-between items-center mt-4">
                         <p className="text-sm text-muted-foreground">Showing {staff.from} to {staff.to} of {staff.total} staff members</p>
                         {/* Insert your Pagination component here */}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
