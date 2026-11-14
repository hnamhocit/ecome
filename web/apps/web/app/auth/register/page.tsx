"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons"
import { IconCheck, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

import { api } from "@workspace/api"
import { useUserStore } from "@workspace/stores"

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Must be at least 8 characters with uppercase, lowercase, number, and special character"
    ),
})

function getSafeReturnUrl(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/"
  return raw
}

function RegisterFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"))

  const { accessToken, isLoading, setAuth } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!isLoading && accessToken) {
      router.replace(returnUrl)
    }
  }, [isLoading, accessToken, returnUrl, router])

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const passwordValue = form.watch("password") ?? ""
  const passwordRules = [
    { label: "8+ characters", valid: passwordValue.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(passwordValue) },
    { label: "Lowercase", valid: /[a-z]/.test(passwordValue) },
    { label: "Number", valid: /[0-9]/.test(passwordValue) },
    { label: "Special symbol", valid: /[#?!@$%^&*-]/.test(passwordValue) },
  ]

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { data } = await api.post("/auth/register", values)

      setAuth(data.accessToken, data.expiresAt)
      toast.success("Account created successfully!")
      router.push(returnUrl)
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Registration failed. Please try again."
        if (error.response?.status === 409) {
          form.setError("email", { message: "This email address is already in use." })
        }
        toast.error(message)
        return
      }
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const loginHref =
    returnUrl !== "/"
      ? `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : "/auth/login"

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white">
          Create an Account
        </h1>
        <p className="text-sm text-stone-500 dark:text-slate-400">
          Start your shopping journey with ECOME
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-stone-700 dark:text-slate-300">
                Full Name
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Alex Morgan"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
                className="h-11 border-stone-300 bg-transparent shadow-xs focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email Field */}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-stone-700 dark:text-slate-300">
                Email
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-11 border-stone-300 bg-transparent shadow-xs focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-transparent"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-stone-700 dark:text-slate-300">
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                  className="h-11 border-stone-300 bg-transparent pr-10 shadow-xs focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-transparent"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 transition hover:text-stone-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Live Password Rules */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {passwordRules.map((r) => (
            <span
              key={r.label}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                r.valid
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-stone-100 text-stone-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <IconCheck className={`size-3 ${r.valid ? "opacity-100" : "opacity-30"}`} />
              <span>{r.label}</span>
            </span>
          ))}
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-11 w-full bg-emerald-600 font-heading font-bold text-white shadow-xs transition-all hover:bg-emerald-500 active:scale-[0.98] dark:bg-primary dark:hover:bg-primary/90"
        >
          {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          <span>{form.formState.isSubmitting ? "Creating account..." : "Create Account"}</span>
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-stone-300 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAFAF9] px-3 text-stone-500 dark:bg-slate-950 dark:text-slate-400">
            Or sign up with
          </span>
        </div>
      </div>

      <SocialAuthButtons returnUrl={returnUrl} />

      <p className="text-center text-sm text-stone-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href={loginHref} className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <IconLoader2 className="size-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  )
}
