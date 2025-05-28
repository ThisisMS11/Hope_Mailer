"use client";
import { LoginForm } from "@/features/authentication/components/LoginForm";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { useRouter } from "@/imports/Nextjs_imports";

const SigninPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user != null) {
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default SigninPage;
