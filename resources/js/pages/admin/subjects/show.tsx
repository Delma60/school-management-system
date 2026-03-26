import React, { useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import { 
  ArrowLeft, BookOpen, Users, FileText, 
  Trash2, Plus, GraduationCap, Clock, Award, CheckCircle2 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from '@/layouts/app-layout'

export default function SubjectShow({ subject, assignedTeachers, availableTeachers }: any) {
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
    <AppLayout>
    <div className="p-6 space-y-6">
      <Head title={`${subject.name} - Details`} />

      {/* Header section */}
      <div className="flex items-center gap-4 mb-8">
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
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <BookOpen className="h-4 w-4" /> {subject.department} Department • {subject.credits} Credits • <span className="capitalize">{subject.type}</span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="teachers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({assignedTeachers.length})</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Subject Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {subject.description || "No description provided for this subject."}
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card>
               <CardContent className="pt-6 flex gap-4 items-center">
                 <div className="p-3 bg-blue-100 text-blue-700 rounded-lg"><Users className="h-5 w-5" /></div>
                 <div><p className="text-sm text-muted-foreground font-bold uppercase">Students Enrolled</p><p className="text-2xl font-black">142</p></div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="pt-6 flex gap-4 items-center">
                 <div className="p-3 bg-green-100 text-green-700 rounded-lg"><Award className="h-5 w-5" /></div>
                 <div><p className="text-sm text-muted-foreground font-bold uppercase">Avg Pass Rate</p><p className="text-2xl font-black">88%</p></div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="pt-6 flex gap-4 items-center">
                 <div className="p-3 bg-orange-100 text-orange-700 rounded-lg"><Clock className="h-5 w-5" /></div>
                 <div><p className="text-sm text-muted-foreground font-bold uppercase">Weekly Hours</p><p className="text-2xl font-black">{subject.credits * 2} hrs</p></div>
               </CardContent>
             </Card>
          </div>
        </TabsContent>

        {/* Teachers Tab (The core feature) */}
        <TabsContent value="teachers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Currently Assigned Teachers */}
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

            {/* Right Col: Assign New Teacher Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Assign Teacher</CardTitle>
                  <CardDescription>Grant a staff member access to manage grades and classes for this subject.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssign} className="space-y-4">
                    <div className="space-y-2">
                      <Select 
                        value={data.teacher_id} 
                        onValueChange={val => setData('teacher_id', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTeachers.length === 0 ? (
                             <SelectItem value="none" disabled>No available teachers</SelectItem>
                          ) : (
                            availableTeachers.map((t: any) => (
                              <SelectItem key={t.id} value={t.id.toString()}>
                                {t.name}
                              </SelectItem>
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
        </TabsContent>

        {/* Syllabus Tab */}
        <TabsContent value="syllabus">
          <Card>
            <CardHeader>
               <CardTitle>Course Syllabus</CardTitle>
               <CardDescription>Upload or update the official curriculum document.</CardDescription>
            </CardHeader>
            <CardContent>
               {subject.has_syllabus ? (
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50/50 border-green-200">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-bold text-green-900">Syllabus Uploaded</p>
                      <p className="text-sm text-green-700">The curriculum document is currently active.</p>
                    </div>
                    <Button variant="outline" className="ml-auto bg-white">View PDF</Button>
                  </div>
               ) : (
                  <Button className="gap-2"><FileText className="h-4 w-4" /> Upload Syllabus PDF</Button>
               )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </AppLayout>
  )
}