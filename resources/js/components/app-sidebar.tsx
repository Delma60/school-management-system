// import { NavFooter } from '@/components/nav-footer';
// import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
// import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { type NavItem } from '@/types';
// import { Link } from '@inertiajs/react';
// import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
// import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         url: '/dashboard',
//         icon: LayoutGrid,
//     },
// ];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         url: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         url: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

// export function AppSidebar() {
//     return (
//         <Sidebar collapsible="icon" variant="inset">
//             <SidebarHeader>
//                 <SidebarMenu>
//                     <SidebarMenuItem>
//                         <SidebarMenuButton size="lg" asChild>
//                             <Link href="/dashboard" prefetch>
//                                 <AppLogo />
//                             </Link>
//                         </SidebarMenuButton>
//                     </SidebarMenuItem>
//                 </SidebarMenu>
//             </SidebarHeader>

//             <SidebarContent>
//                 <NavMain items={mainNavItems} />
//             </SidebarContent>

//             <SidebarFooter>
//                 <NavFooter items={footerNavItems} className="mt-auto" />
//                 <NavUser />
//             </SidebarFooter>
//         </Sidebar>
//     );
// }


import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Users, BookOpen,
  Wallet, Settings, ChevronRight, School,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { sub } from 'date-fns';

export function AppSidebar() {
  // Get current URL from Inertia to handle active states
  const { url } = usePage();



const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: url === "/dashboard",
  },
  {
    title: 'Academics',
    url: '/dashboard/academics',
    icon: BookOpen,
    isActive: url.startsWith('/dashboard/academics'),
    items: [
      { title: 'Classrooms', url: '/dashboard/academics/classrooms' },
      { title: 'Subjects & Curricula', url: '/dashboard/academics/subjects' },
      { title: 'Timetables', url: '/dashboard/academics/timetables' },
      { title: 'Examinations', url: '/dashboard/academics/exams' },
    ],
  },
  {
    title: 'Students',
    url: '/dashboard/students',
    icon: Users,
    isActive: url.startsWith('/dashboard/students'),
    items: [
      { title: 'Student Directory', url: '/dashboard/students' },
      { title: 'Admissions', url: route("admissions.create") },
      { title: 'Attendance', url: '/dashboard/students/attendances' },
      { title: 'Performance Logs', url: '/dashboard/students/performance' },
    ],
  },
  {
    title: 'Staff Management', // CRUD for Teachers and Non-academic staff
    url: route("staffs.others"),
    icon: UserCheck,
    isActive: url.startsWith('/dashboard/staff'),
    items: [
      { title: 'Teacher Directory', url: route("teachers.index") },
      { title: 'Non-Academic Staff', url: route("staffs.others") },
      { title: 'Payroll & Leave', url: route("payroll.index") },
    ],
  },
  {
    title: 'Finance',
    url: '/dashboard/finance',
    icon: Wallet,
    isActive: url.startsWith('/dashboard/finance'),
    items: [
      { title: 'Fee Management', url: '/dashboard/finance/fees' },
      { title: 'Expenses', url: '/dashboard/finance/expenses' },
      { title: 'Reports', url: '/dashboard/finance/reports' },
    ],
  },
  {
    title: 'Administration', // This covers Roles and Permissions
    url: '/dashboard/admin',
    icon: ShieldCheck,
    isActive: url.startsWith('/dashboard/admin'),
    items: [
      { title: 'Roles & Permissions', url: '/dashboard/roles' },
      { title: 'System Logs', url:  route("system-logs.index") },
      { title: 'School Profile', url: route("school-profile.index") },
    ],
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    isActive: url.startsWith('/dashboard/settings'),
  },
];

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
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    /* Collapsible Menu Item for categories with sub-items */
                    <Collapsible defaultOpen={item.isActive} className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={url === subItem.url || subItem.url.includes(url) || url.includes(subItem.url)}>
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    /* Standard Menu Item without sub-items */
                    <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
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
                 {/* Placeholder for user avatar */}
                 <span className="text-xs font-bold">AJ</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin Jane</span>
                <span className="truncate text-xs text-slate-500">Principal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
