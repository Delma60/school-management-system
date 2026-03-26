import { CreateRoleModal } from '@/components/create-roles-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Save, ShieldAlert, UserCircle } from 'lucide-react'; // Added ShieldAlert for empty state
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RolesPermissions({ roles, permissionGroups }: any) {
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        name: selectedRole?.name || "",
        slug: selectedRole?.slug || "",
        permissions: [] as number[],
    });

    // FIX: Update form data when selectedRole changes
    useEffect(() => {
        if (selectedRole) {
            setData('permissions', selectedRole.permissions?.map((p: any) => p.id) || []);
        }
    }, [selectedRole]);

    const togglePermission = (id: number) => {
        const current = [...data.permissions];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData('permissions', current);
    };

    const selectRole = (role: any) => {
        setSelectedRole(role);
        setData("name", role.name);
        setData("slug", role.slug);
    }

    const handleSave = () => {
        patch(route('roles.update', selectedRole.id), {
            onSuccess: () => toast.success('Permissions updated successfully'),
            onError: (error) => {
                console.log(error)
                toast.error('Failed to update permissions')
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="Roles & Permissions" />

                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
                        <p className="text-muted-foreground">Define what different user groups can see and perform.</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(true)}>
                        <UserCircle className="h-4 w-4" /> Create New Role
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Sidebar: Role List */}
                    <Card className="h-fit lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">User Roles</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {roles.map((role: any) => (
                                <button
                                    key={role.id}
                                    onClick={() => selectRole(role)}
                                    className={`hover:bg-muted/50 flex w-full flex-col gap-1 px-6 py-4 text-left transition-colors ${
                                        selectedRole?.id === role.id ? 'bg-primary/5 border-primary border-r-2' : ''
                                    }`}
                                >
                                    <span className={`font-bold ${selectedRole?.id === role.id ? 'text-primary' : ''}`}>{role.name}</span>
                                    <span className="text-muted-foreground text-xs capitalize">{role.slug}</span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Main: Permission Matrix */}
                    <Card className="lg:col-span-9">
                        {!selectedRole ? (
                            <div className="text-muted-foreground flex h-64 flex-col items-center justify-center">
                                <ShieldAlert className="mb-2 h-10 w-10 opacity-20" />
                                <p>Select a role to manage permissions</p>
                            </div>
                        ) : (
                            <>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <div>
                                        <CardTitle className="text-xl">Permissions for {selectedRole.name}</CardTitle>
                                        <CardDescription>Changes affect all users assigned to this role.</CardDescription>
                                    </div>
                                    <Button onClick={handleSave} disabled={processing} className="gap-2">
                                        <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Permissions'}
                                    </Button>
                                </CardHeader>

                                <Separator />

                                <CardContent className="p-0">
                                    <ScrollArea className="h-[600px] p-6">
                                        <div className="space-y-8">
                                            {/* Logic Fix: Safely iterate through groups */}
                                            {Object.entries(permissionGroups).map(([groupName, permissions]: [string, any]) => (
                                                <div key={groupName} className="space-y-4">
                                                    <h3 className="text-primary border-b pb-2 text-sm font-bold tracking-wide uppercase">
                                                        {groupName}
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {permissions.map((perm: any) => (
                                                            <div
                                                                key={perm.id}
                                                                className={`hover:bg-muted/30 flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-colors ${
                                                                    data.permissions.includes(perm.id) ? 'border-primary/30 bg-primary/5' : 'bg-card'
                                                                }`}
                                                                onClick={() => togglePermission(perm.id)}
                                                            >
                                                                <Checkbox
                                                                    checked={data.permissions.includes(perm.id)}
                                                                    // Checkbox is already handled by the parent div onClick
                                                                    onCheckedChange={() => {}}
                                                                />
                                                                <div className="grid gap-1.5 leading-none">
                                                                    <label className="cursor-pointer text-sm leading-none font-medium">
                                                                        {perm.label || perm.name}
                                                                    </label>
                                                                    {perm.description && (
                                                                        <p className="text-muted-foreground text-xs">{perm.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            </div>
            <CreateRoleModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </AppLayout>
    );
}
