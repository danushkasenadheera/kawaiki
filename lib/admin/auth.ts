import "server-only";
import { redirect } from "next/navigation";
import { hasSupabase } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/** The signed-in admin, or null. Always checks the admins table, not just the session. */
export async function getAdmin() {
  if (!hasSupabase) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("admins").select("id, email").eq("id", user.id).maybeSingle();
  if (!data) return null;
  return { id: user.id, email: user.email ?? data.email, supabase };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login/");
  return admin;
}
