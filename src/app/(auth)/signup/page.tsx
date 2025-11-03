
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <>
       <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium text-primary hover:text-primary/90">
              Log in
            </Link>
          </p>
      </div>
      <SignupForm />
    </>
  );
}
