import React, { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Loader2, User, GraduationCap, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export function CreateStudentSheet({ isOpen, setIsOpen, classrooms }: { isOpen:boolean; classrooms:[]; setIsOpen:React.Dispatch<React.SetStateAction<boolean>> }) {
  const [step, setStep] = useState(1);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: 'password123', // Default password or generated
    classroom_id: '',
    admission_no: '',
    parent_name: '',
    parent_phone: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('students.store'), {
      onSuccess: () => {
        toast.success("Student enrolled successfully")
        setIsOpen(false)
        setStep(1)
        reset()
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Enroll New Student</SheetTitle>
          <SheetDescription>
            Step {step} of 3: {step === 1 ? 'Personal Details' : step === 2 ? 'Academic Records' : 'Guardian Info'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="space-y-6 pb-20">
          {/* STEP 1: PERSONAL ACCOUNT */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="John Doe" />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">School Email</Label>
                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="j.doe@school.com" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC ASSIGNMENT */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label>Assign Classroom</Label>
                <Select value={data.classroom_id} onValueChange={val => setData('classroom_id', val)}>
                  <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>
                    {classrooms.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name} ({cls.grade_level})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classroom_id && <p className="text-xs text-destructive">{errors.classroom_id}</p>}
              </div>
              <div className="space-y-2">
                <Label>Admission Number</Label>
                <Input value={data.admission_no} onChange={e => setData('admission_no', e.target.value)} placeholder="STD-2026-001" />
              </div>
            </div>
          )}

          {/* STEP 3: GUARDIAN INFO */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label>Parent/Guardian Name</Label>
                <Input value={data.parent_name} onChange={e => setData('parent_name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Parent Phone Number</Label>
                <Input value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)} />
              </div>
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t flex justify-between gap-4 sm:relative sm:border-none sm:p-0 sm:mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            
            {step < 3 ? (
              <Button type="button" className="ml-auto" onClick={() => setStep(step + 1)}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="ml-auto" disabled={processing}>
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Enrollment
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}