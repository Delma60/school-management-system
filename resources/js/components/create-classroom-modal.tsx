import React from "react"
import { useForm } from "@inertiajs/react"
import { Loader2, DoorOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { toast } from "sonner"

interface CreateClassroomProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function CreateClassroomModal({ isOpen, setIsOpen }: CreateClassroomProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    grade_level: '',
    room_number: '',
    capacity: 30,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    
    post(route("classrooms.store"), {
      onSuccess: () => {
        setIsOpen(false)
        reset()
        toast.success("Successfully")
        // Your Sonner toast will automatically pick up the success flash!
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-primary" />
              Create New Classroom
            </DialogTitle>
            <DialogDescription>
              Define a new section, its grade level, and physical capacity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Section Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Section Name <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                placeholder="e.g., 10-A or SS1 Science" 
                value={data.name} 
                onChange={e => setData('name', e.target.value)} 
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Grade Level */}
            <div className="grid gap-2">
              <Label htmlFor="grade_level">Grade Level <span className="text-destructive">*</span></Label>
              <Select onValueChange={(value) => setData('grade_level', value)} value={data.grade_level}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 9">Grade 9 (JSS 3)</SelectItem>
                  <SelectItem value="Grade 10">Grade 10 (SS 1)</SelectItem>
                  <SelectItem value="Grade 11">Grade 11 (SS 2)</SelectItem>
                  <SelectItem value="Grade 12">Grade 12 (SS 3)</SelectItem>
                </SelectContent>
              </Select>
              {errors.grade_level && <p className="text-xs text-destructive">{errors.grade_level}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Room Number */}
              <div className="grid gap-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input 
                  id="room_number" 
                  placeholder="e.g., B-102" 
                  value={data.room_number} 
                  onChange={e => setData('room_number', e.target.value)} 
                />
                {errors.room_number && <p className="text-xs text-destructive">{errors.room_number}</p>}
              </div>

              {/* Capacity */}
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity <span className="text-destructive">*</span></Label>
                <Input 
                  id="capacity" 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={data.capacity} 
                  onChange={e => setData('capacity', Number(e.target.value))} 
                />
                {errors.capacity && <p className="text-xs text-destructive">{errors.capacity}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Classroom
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}