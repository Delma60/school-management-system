import React from 'react'
import { useForm } from '@inertiajs/react'
import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator" // Added missing import
import { Loader2, UserPlus, Mail, Briefcase } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTeacherSheet({ open, onOpenChange }: Props) {
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    department: '',
    designation: 'Lecturer',
    joining_date: new Date().toISOString().split('T')[0],
  })

  // Close handler that cleans up the form state
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      clearErrors();
    }
    onOpenChange(isOpen);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('teachers.store'), {
      onSuccess: () => {
        reset()
        onOpenChange(false)
        toast.success("Teacher onboarded successfully!")
      },
        onError: () => {toast.error("Failed to onboard teacher. Please check the form for errors.")}
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <form onSubmit={submit} className="flex flex-col h-full space-y-6">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Add Teacher to Faculty
            </SheetTitle>
            <SheetDescription>
              Create a new user account with the Teacher role. An invitation email will be queued.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 py-4">
            {/* Name Section */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="e.g. Professor Albus"
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name}</p>}
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3 w-3" /> Work Email
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="albus@academy.edu"
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-[11px] text-destructive font-medium">{errors.email}</p>}
            </div>

            <Separator />

            {/* Department & Designation (Meta Data) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3" /> Department
                </Label>
                {/* Fixed: Added 'value' to strictly control state */}
                <Select value={data.department} onValueChange={val => setData('department', val)}>
                  <SelectTrigger className={errors.department ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-[11px] text-destructive font-medium">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label>Designation</Label>
                {/* Fixed: Added 'value' to strictly control state */}
                <Select value={data.designation} onValueChange={val => setData('designation', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Head of Dept">Head of Dept</SelectItem>
                    <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input
                id="joining_date"
                type="date"
                value={data.joining_date}
                onChange={e => setData('joining_date', e.target.value)}
                className={errors.joining_date ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.joining_date && <p className="text-[11px] text-destructive font-medium">{errors.joining_date}</p>}
            </div>
          </div>

          {/* Footer with improved responsive layout */}
          <SheetFooter className="pt-6 border-t flex-col sm:flex-row sm:justify-end gap-3 sm:gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="w-full sm:w-auto">
              {processing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                "Onboard Teacher"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
