'use client'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import DottedSeperator from "@/components/dotted-seperator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { registerSchema } from '../schemas'
import { useRegister } from '../api/use-register'

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values })
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          Sign Up
        </CardTitle>
        <CardDescription>
          By signing up you agree to our{' '}
          <Link href={'/privacy'}>
            <span className='text-blue-700'>Privacy Policy</span>
          </Link>{' '}
          and{' '}
          <Link href={'/terms'}>
            <span className='text-blue-700'>Terms of service</span>
          </Link>{' '}
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Enter password"
                      min={8}
                      max={256}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button disabled={isPending} size={"lg"} className="w-full">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button disabled={isPending} variant={"secondary"} size={"lg"} className="w-full">
          <FcGoogle className='mr-2 size-5' />
          Login with Google
        </Button>
        <Button disabled={isPending} variant={"secondary"} size={"lg"} className="w-full">
          <FaGithub className='mr-2 size-5' />
          Login with GitHub
        </Button>
      </CardContent>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7 flex items-center justify-center text-sm'>
        <p>
          Already have an account?
          <Link href='/sign-in'><span className='text-blue-700'>&nbsp; Login</span></Link>
        </p>
      </CardContent>
    </Card>
  )
}
