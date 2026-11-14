"use client"

import { Suspense, useEffect, useRef, useState } from "react"
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
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

import { api } from "@workspace/api"
import { useUserStore } from "@workspace/stores"

const OAUTH_ERRORS: Record<string, string> = {
  external_auth_failed: "Authentication with third-party provider failed or was canceled.",
  missing_provider_id: "Could not retrieve account identity from provider.",
  oauth_login_failed: "Failed to establish authenticated session. Please try again.",
  session_failed: "Session is invalid. Please sign in again.",
  network_error: "Connection error to authentication server.",
}

const loginSchema = z.object({
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

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"))
  const oauthError = searchParams.get("error")

  const { accessToken, isLoading, setAuth } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)
  const shownErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isLoading && accessToken) {
      router.replace(returnUrl)
    }
  }, [isLoading, accessToken, returnUrl, router])

  useEffect(() => {
    if (oauthError && shownErrorRef.current !== oauthError) {
      shownErrorRef.current = oauthError
      toast.error(OAUTH_ERRORS[oauthError] ?? "Social login failed.")
    }
  }, [oauthError])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await api.post("/auth/login", values)

      setAuth(data.accessToken, data.expiresAt)
      toast.success("Successfully signed in!")
      router.push(returnUrl)
      router.refresh()
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Invalid email or password.")
        : "An unexpected error occurred. Please try again."
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white">
          Sign In
        </h1>
        <p className="text-sm text-stone-500 dark:text-slate-400">
          Enter your email and password to access your account
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={field.name} className="text-stone-700 dark:text-slate-300">
                  Password
                </FieldLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-11 w-full bg-emerald-600 font-heading font-bold text-white shadow-xs transition-all hover:bg-emerald-500 active:scale-[0.98] dark:bg-primary dark:hover:bg-primary/90"
        >
          {form.formState.isSubmitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          <span>{form.formState.isSubmitting ? "Signing in..." : "Sign In"}</span>
        </Button>
      </form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-stone-300 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAFAF9] px-3 text-stone-500 dark:bg-slate-950 dark:text-slate-400">
            Or continue with
          </span>
        </div>
      </div>

      <SocialAuthButtons returnUrl={returnUrl} />

      <p className="text-center text-sm text-stone-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
          Sign up now
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <IconLoader2 className="size-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  )
}
