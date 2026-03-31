import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function FlashNotifications() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error]);

    useEffect(() => {
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash?.warning]);

    useEffect(() => {
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash?.info]);

    return null;
}
