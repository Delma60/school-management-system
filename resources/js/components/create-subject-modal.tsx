import React from 'react'
import { useForm } from '@inertiajs/react'
import { Loader2, BookPlus, Hash, GraduationCap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'

export function CreateSubjectModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    code: '',
    department: '',
    type: 'core',
    credits: '1.0',
    description: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('subjects.store'), {
      onSuccess: () => {
        setIsOpen(false)
        reset()
        toast.success("Successfully created subject")
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookPlus className="h-5 w-5 text-primary" />
              Add New Subject
            </DialogTitle>
            <DialogDescription>
              Define a new course for the curriculum. All fields except description are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Name and Code Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Further Mathematics" 
                  value={data.name} 
                  onChange={e => setData('name', e.target.value)} 
                />
                {errors.name && <p className="text-[10px] text-destructive font-medium">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code" className="flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Course Code
                </Label>
                <Input 
                  id="code" 
                  placeholder="MAT-201" 
                  className="font-mono uppercase"
                  value={data.code} 
                  onChange={e => setData('code', e.target.value.toUpperCase())} 
                />
                {errors.code && <p className="text-[10px] text-destructive font-medium">{errors.code}</p>}
              </div>
            </div>

            {/* Dept and Type Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Select onValueChange={val => setData('department', val)}>
                  <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Arts">Arts & Humanities</SelectItem>
                    <SelectItem value="Commerce">Commerce</SelectItem>
                    <SelectItem value="Vocational">Vocational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Subject Type</Label>
                <Select defaultValue="core" onValueChange={val => setData('type', val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core Requirement</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                    <SelectItem value="vocational">Vocational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="credits">Credit Weight (0.5 - 5.0)</Label>
              <Input 
                id="credits" 
                type="number" 
                step="0.5"
                value={data.credits} 
                onChange={e => setData('credits', e.target.value)} 
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Brief Syllabus Overview</Label>
              <Textarea 
                id="description" 
                placeholder="Key learning objectives..." 
                className="resize-none"
                value={data.description} 
                onChange={e => setData('description', e.target.value)} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit"  disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}