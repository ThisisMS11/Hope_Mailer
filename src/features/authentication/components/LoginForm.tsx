"use client";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/imports/Shadcn_imports";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { requestLogin } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    requestLogin.mutate({ email: values.email, password: values.password });
  };

  return (
    <div
      className={cn(
        "w-full bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/70 dark:border-white/[0.08] shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl p-8",
        className,
      )}
      {...props}
    >
      {/* Brand */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Syncmate
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    type="email"
                    className="bg-white/50 dark:bg-white/[0.06] border-white/70 dark:border-white/[0.1] backdrop-blur-sm focus:ring-violet-500/30 dark:focus:ring-violet-400/20 dark:text-gray-100 dark:placeholder:text-gray-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </FormLabel>
                  <a
                    href="#"
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-white/50 dark:bg-white/[0.06] border-white/70 dark:border-white/[0.1] backdrop-blur-sm focus:ring-violet-500/30 dark:focus:ring-violet-400/20 dark:text-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-600/80 dark:hover:bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/20 transition-all"
            disabled={requestLogin.isPending}
          >
            {requestLogin.isPending ? "Signing in..." : "Sign in"}
          </Button>

          {requestLogin.isError && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">
              {requestLogin.error?.message || "Login failed"}
            </p>
          )}
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
        Don&apos;t have an account?{" "}
        <a
          href="#"
          className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}
