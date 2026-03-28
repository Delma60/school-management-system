import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Teacher } from '@/types';
import { useForm } from '@inertiajs/react';
import { KeyRound, Loader2, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface ResetPasswordProps {
    user: Teacher
}

export function ResetPasswordModal({ user }: ResetPasswordProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            clearErrors();
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('staff.password.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                toast.success(`Password for ${user.name} has been updated.`);
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-amber-200">
                    <KeyRound className="h-4 w-4" />
                    Reset Password
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-amber-500" />
                            Reset Staff Password
                        </DialogTitle>
                        <DialogDescription>
                            You are forcing a password change for <strong>{user.name}</strong> ({user.email}). They will be required to use this new password immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter new password"
                                autoFocus
                            />
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Re-type new password"
                            />
                            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                            Update Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
