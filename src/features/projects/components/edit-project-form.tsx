'use client'

import { useEffect, useRef, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { updateProjectSchema } from "../schemas"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import DottedSeperator from "@/components/dotted-seperator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Project } from '../types'
import { toast } from 'sonner'
import { useUpdateProject } from '../api/use-update-project'
import { useConfirm } from '@/hooks/use-confirm'
import { useDeleteProject } from '../api/use-delete-project'

interface EditProjectFormProps {
  onCancel?: () => void
  initalValues: Project
}

export const EditProjectForm = ({ onCancel, initalValues } : EditProjectFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useUpdateProject()
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject()

  console.log(initalValues)

  const [ DeleteDialog, confirmDelete ] = useConfirm(
    'Delete Project',
    'This action cannot be undone!',
    'destructive'
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initalValues,
      image: initalValues.imageUrl ?? ''
    }
  })

  const handleDelete = async () => {
    const ok = await confirmDelete()

    if(!ok) return 

    deleteProject({ 
      param: { projectId: initalValues.$id }
    }, 
    {
      onSuccess: () => {
        window.location.href = `/workspaces/${initalValues.workspaceId}`
      }
    })
  }

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }
    mutate({ form: finalValues, param: { projectId: initalValues.$id } })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      form.setValue('image', file)
    }
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button 
            size={'sm'} 
            variant={'secondary'} 
            onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initalValues.workspaceId}/projects/${initalValues.$id}`)}
          >
            <ArrowLeftIcon className='size-4 mr-2' />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initalValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField 
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Project Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className='flex flex-col gap-y-2 my-2'>
                      <div className='flex items-center gap-x-5'>
                        {field.value ? (
                          <div className='size-[72px] relative rounded-md overflow-hidden'>
                            <Image 
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt={'Logo'}
                              fill
                              className='object-cover'
                            />
                          </div>
                        ) : (
                          <Avatar className='size-[72px]'>
                            <AvatarFallback>
                              <ImageIcon className='size-[36px] text-neutral-400' />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className='flex flex-col'>
                          <p className='text-sm'>Project Icon</p>
                          <p className='text-sm text-muted-foreground'>JPG, PNG, SVG or JPEG, max 1mb</p>
                          <input 
                            className='hidden' 
                            accept='.jpg, .png, .jpeg, .svg' 
                            type='file' 
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type='button'
                              disabled={isPending}
                              variant={'destructive'}
                              size={'xs'}
                              className='w-fit mt-2'
                              onClick={() => {
                                field.onChange(null)
                                if(inputRef.current) {
                                  inputRef.current.value = ''
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type='button'
                              disabled={isPending}
                              variant={'teritary'}
                              size={'xs'}
                              className='w-fit mt-2'
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeperator className="py-7"/>
              <div className="flex items-center justify-between">
                <Button 
                  disabled={isPending} 
                  type="button" size={"lg"} 
                  variant={"secondary"} 
                  onClick={onCancel}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>
                <Button 
                  disabled={isPending} 
                  type="submit" 
                  size={"lg"}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Danger Zone</h3>
            <p className='text-sm text-muted-foreground'>
              Deleting a project is irreversible and will remove all associated data. 
            </p>
            <DottedSeperator className='py-7' />
            <Button
              className='mt-6 w-fit ml-auto'
              size={'sm'}
              variant={'destructive'}
              type='button'
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
