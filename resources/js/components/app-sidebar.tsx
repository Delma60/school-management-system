import { Link, usePage } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react'; // Import all icons for dynamic mapping
import { ChevronRight, School } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { NavGroup } from '@/types';

// 1. Helper to render Lucide components dynamically from a string
const DynamicIcon = ({ name, className }: { name?: string; className?: string }) => {
    if (!name) return null;
    
    const IconComponent = LucideIcons[name];
    
    // Fallback to a default circle if the icon name is misspelled or doesn't exist
    if (!IconComponent) return <LucideIcons.Circle className={className} />;
    
    return <IconComponent className={className} />;
};

// 2. Helper to extract user initials (e.g., "John Doe" -> "JD")
const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

export function AppSidebar() {
    const {
        url,
        props: { auth, sidebar: sidebarNavItems },
    } = usePage<any>();

    return (
        <Sidebar variant="inset">
            {/* 1. School Logo / Brand Area */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                    <School className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-slate-900 dark:text-white">Greenwood High</span>
                                    <span className="text-xs text-slate-500">Admin Portal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* 2. Main Navigation Content */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {(sidebarNavItems || []).map((item:NavGroup) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.items && item.items.length > 0 ? (
                                        /* Collapsible Menu Item for categories with sub-items */
                                        <Collapsible defaultOpen={item.isActive} className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    {/* Dynamically render the icon */}
                                                    <DynamicIcon name={item.icon} className="size-4" />
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => {
                                                        // Format the URL safely based on named routes vs paths
                                                        const itemUrl = subItem.url.startsWith('/') 
                                                            ? subItem.url 
                                                            : route(subItem.url);

                                                        // Sub-item active state
                                                        const isSubActive = url === subItem.url || url.startsWith(subItem.url.replace('.index', ''));

                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                                    <Link href={itemUrl}>{subItem.title}</Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        /* Standard Menu Item without sub-items */
                                        <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                                            <Link href={item.url.startsWith('/') ? item.url : route(item.url)}>
                                                <DynamicIcon name={item.icon} className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* 3. Footer / User Profile */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {getInitials(auth?.user?.name)}
                                </span>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{auth?.user?.name || 'Guest User'}</span>
                                <span className="truncate text-xs text-slate-500">{auth?.user?.role?.name || 'Staff'}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}