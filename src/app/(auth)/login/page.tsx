
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-medium text-primary hover:text-primary/90">
              Sign up
            </Link>
          </p>
      </div>
      <LoginForm />
    </>
  );
}
