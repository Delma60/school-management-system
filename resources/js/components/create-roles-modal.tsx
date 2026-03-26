import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Loader2, ShieldPlus } from 'lucide-react'
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
import { toast } from 'sonner'

export function CreateRoleModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    slug: '',
    description: '',
  })

  // Auto-generate slug from name: "Dean of Studies" -> "dean_of_studies"
  useEffect(() => {
    const slugified = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
    setData('slug', slugified);
  }, [data.name]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('roles.store'), {
      onSuccess: () => {
        setIsOpen(false)
        reset()
        toast.success('Role created successfully! You can now assign permissions to it.')
      },
      onError:(error) => {
            toast.error('Failed to create role. Please check the form for errors.')
            console.log(error)

      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldPlus className="h-5 w-5 text-primary" />
              Create Custom Role
            </DialogTitle>
            <DialogDescription>
              Add a new group (e.g., "Librarian"). You can configure specific permissions after saving.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="e.g. Lab Assistant"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-muted-foreground flex justify-between">
                System Slug <span className="text-[10px] font-mono uppercase">Read Only</span>
              </Label>
              <Input
                id="slug"
                value={data.slug}
                readOnly
                className="bg-muted font-mono text-xs"
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                placeholder="Briefly define the purpose of this role..."
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing || !data.name}>
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
