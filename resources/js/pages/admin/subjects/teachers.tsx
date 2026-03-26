import React from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import { Users, Trash2, Plus, GraduationCap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubjectHeader } from '@/components/subject-header'

export default function SubjectTeachers({ subject, assignedTeachers, availableTeachers }: any) {
  const { data, setData, post, processing, reset } = useForm({
    teacher_id: '',
  });

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('academics.subjects.assign', subject.id), {
      onSuccess: () => reset('teacher_id')
    });
  };

  const handleRemove = (teacherId: number) => {
    if (confirm('Are you sure you want to remove this teacher from the subject?')) {
      router.delete(route('academics.subjects.remove-teacher', [subject.id, teacherId]));
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <Head title={`${subject.name} - Teachers`} />
      
      {/* Shared Header & Navigation */}
      <SubjectHeader subject={subject} />

      {/* Page Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Col: Roster */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> Faculty Roster
          </h3>
          
          {assignedTeachers.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Users className="h-8 w-8 mb-2 opacity-50" />
                <p>No teachers assigned to {subject.code} yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignedTeachers.map((teacher: any) => (
                <Card key={teacher.id} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {teacher.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{teacher.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(teacher.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Assign Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Assign Teacher</CardTitle>
              <CardDescription>Grant a staff member access to manage grades for this subject.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssign} className="space-y-4">
                <div className="space-y-2">
                  <Select value={data.teacher_id} onValueChange={val => setData('teacher_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeachers.length === 0 ? (
                         <SelectItem value="none" disabled>No available teachers</SelectItem>
                      ) : (
                        availableTeachers.map((t: any) => (
                          <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={processing || !data.teacher_id}>
                  <Plus className="h-4 w-4" /> Assign to Subject
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}