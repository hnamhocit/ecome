"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { IconLoader2, IconMailCheck } from "@tabler/icons-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message ?? "An error occurred. Please try again.")
        return
      }

      setIsSuccess(true)
    } catch {
      toast.error("Could not connect to the server. Please try again.")
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          <IconMailCheck className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white">
          Check Your Inbox
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We have sent a password reset link to{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {form.getValues().email}
          </span>
          . Please check your inbox and spam folder.
        </p>
        <Link
          href="/auth/login"
          className="mt-4 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Return to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your registered email address to receive a recovery link
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-slate-700 dark:text-slate-300">
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11 border-slate-300 bg-transparent shadow-xs focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-11 w-full bg-emerald-600 font-heading font-bold text-white shadow-xs transition-all hover:bg-emerald-500 active:scale-[0.98] dark:bg-primary dark:hover:bg-primary/90"
        >
          {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          <span>{form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}</span>
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered your password?{" "}
        <Link href="/auth/login" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Sign In
        </Link>
      </p>
    </div>
  )
}
