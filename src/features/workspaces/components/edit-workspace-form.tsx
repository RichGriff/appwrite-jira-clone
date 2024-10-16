'use client'

import { useEffect, useRef, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { updateWorkspaceSchema } from "../schemas"
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
import { Workspace } from '../types'
import { useUpdateWorkspace } from '../api/use-update-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { useDeleteWorkspace } from '../api/use-delete-workspace'
import { toast } from 'sonner'
import { useResetInviteCode } from '../api/use-reset-invite-code'

interface EditWorkspaceFormProps {
  onCancel?: () => void
  initalValues: Workspace
}

export const EditWorkspaceForm = ({ onCancel, initalValues } : EditWorkspaceFormProps) => {
  const router = useRouter()
  const { mutate, isPending } = useUpdateWorkspace()
  const { mutate: deleteWorkspace, isPending: isDeleteWorkspace } = useDeleteWorkspace()
  const { mutate: resetInviteCode, isPending: isResetInviteCode } = useResetInviteCode()

  const [fullInviteLink, setFullInviteLink] = useState('')

  const [ DeleteDialog, confirmDelete ] = useConfirm(
    'Delete Workpace',
    'This action cannot be undone!',
    'destructive'
  )

  const [ ResetDialog, confirmReset ] = useConfirm(
    'Reset Invite Link',
    'This will invalidate the current invite link.',
    'destructive'
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullInviteLink(`${window.location.origin}/workspaces/${initalValues.$id}/join/${initalValues.inviteCode}`)
    }
  }, [initalValues.$id, initalValues.inviteCode])

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initalValues,
      image: initalValues.imageUrl ?? ''
    }
  })

  const handleResetInviteCode = async () => {
    const ok = await confirmReset()

    if(!ok) return 

    resetInviteCode({ 
      param: { workspaceId: initalValues.$id }
    }, 
    {
      onSuccess: () => {
        router.refresh()
      }
    })
  }

  const handleDelete = async () => {
    const ok = await confirmDelete()

    if(!ok) return 

    deleteWorkspace({ 
      param: { workspaceId: initalValues.$id }
    }, 
    {
      onSuccess: () => {
        window.location.href = '/'
      }
    })
  }

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ''
    }
    mutate({ form: finalValues, param: { workspaceId: initalValues.$id } }, {
      onSuccess: ({ data }) => {
        form.reset()
        router.push(`/workspaces/${data.$id}`)
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      form.setValue('image', file)
    }
  }

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink)
      .then(() => toast.success('Invite link copied to clipboard'))
  }

  return (
    <div className='flex flex-col gap-y-4'>
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button 
            size={'sm'} 
            variant={'secondary'} 
            onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initalValues.$id}`)}
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
                        Workspace Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter workspace name" {...field} />
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
                          <p className='text-sm'>Workspace Icon</p>
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
            <h3 className='font-bold'>Invite Members</h3>
            <p className='text-sm text-muted-foreground'>
              Use the invite link to add members to your workspace.
            </p>
            <div className='mt-4'>
              <div className='flex items-center gap-x-2'>
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant={'secondary'}
                  className='size-12'
                >
                  <CopyIcon className='size-5' />
                </Button>
              </div>
            </div>
            <DottedSeperator className='py-7' />
            <Button
              className='mt-6 w-fit ml-auto'
              size={'sm'}
              variant={'destructive'}
              type='button'
              disabled={isPending || isResetInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Danger Zone</h3>
            <p className='text-sm text-muted-foreground'>
              Deleting a workspace is irreversible and will remove all associated data. 
            </p>
            <DottedSeperator className='py-7' />
            <Button
              className='mt-6 w-fit ml-auto'
              size={'sm'}
              variant={'destructive'}
              type='button'
              disabled={isPending || isDeleteWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
