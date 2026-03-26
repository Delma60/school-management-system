import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SubjectHeader({ subject }: { subject: any }) {
  const { url } = usePage();

  const navItems = [
    { name: 'Overview', href: `/dashboard/academics/subjects/${subject.id}` },
    { name: 'Teachers', href: `/dashboard/academics/subjects/${subject.id}/teachers` },
    { name: 'Syllabus', href: `/dashboard/academics/subjects/${subject.id}/syllabus` },
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/academics/subjects">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
            <Badge variant="secondary" className="font-mono text-sm">{subject.code}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1 text-sm">
            <BookOpen className="h-4 w-4" /> {subject.department} Department • {subject.credits} Credits • <span className="capitalize">{subject.type}</span>
          </p>
        </div>
      </div>

      {/* Sub-Navigation (Looks like tabs, acts like links) */}
      <div className="flex space-x-1 border-b pb-[1px]">
        {navItems.map((item) => {
          // Check if this is the active page
          const isActive = url === item.href || url.startsWith(`${item.href}?`);
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}>
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}