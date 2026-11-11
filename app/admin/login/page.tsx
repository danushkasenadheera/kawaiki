import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { images } from "@/lib/site";
import { hasSupabase } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm ring-1 ring-black/5">
        <Image src={images.logo.src} alt="Kawaiki Tours & Travels" width={96} height={96} className="mx-auto size-24" />
        <h1 className="mt-4 text-center text-2xl">Admin sign in</h1>
        {!hasSupabase && (
          <p className="mt-4 rounded bg-orange/10 p-3 text-sm text-orange">
            Supabase isn&apos;t connected yet. Add the environment variables from <code>.env.example</code> to enable sign-in.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
