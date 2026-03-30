import {
    BookOpen,
    Briefcase,
    Layout,
    LayoutDashboard,
    Megaphone,
    Settings,
    ShieldCheck,
    UserCheck,
    Users,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    BookOpen,
    Megaphone,
    Settings,
    ShieldCheck,
    UserCheck,
    Briefcase,
    Users,
    Wallet,
    Layout, // Fallback
};

export const getIcon = (iconName: string | null): LucideIcon | null => {
    if (!iconName) return null;
    return iconMap[iconName] || null;
};

export const getAllIconOptions = (): Record<string, LucideIcon> => {
    return iconMap;
};
