"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="grid gap-1 text-sm">
        Email
        <input className="field" type="email" name="email" required autoComplete="username" />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input className="field" type="password" name="password" required autoComplete="current-password" />
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-pink">
          {state.message}
        </p>
      )}
      <button type="submit" className="btn btn-teal" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
