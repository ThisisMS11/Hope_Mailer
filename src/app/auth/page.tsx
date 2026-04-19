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
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white dark:bg-[#09090b] overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-400/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default SigninPage;
