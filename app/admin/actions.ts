"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { parseTourInput } from "@/lib/admin/validate";
import { hasSupabase } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { TOURS_TAG } from "@/lib/tours";

export type ActionState = { ok: boolean; message: string } | null;

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabase) return { ok: false, message: "Supabase is not configured yet. Add the environment variables first." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { ok: false, message: "Incorrect email or password." };

  const { data: admin } = await supabase.from("admins").select("id").eq("id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have admin access." };
  }
  redirect("/admin/");
}

export async function signOut() {
  if (hasSupabase) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login/");
}

export async function saveTour(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { ok: false, message: "Could not read the form data." };
  }

  const parsed = parseTourInput(raw);
  if ("error" in parsed) return { ok: false, message: parsed.error };

  if (parsed.id) {
    const { error } = await supabase.from("tours").update(parsed.data).eq("id", parsed.id);
    if (error) return { ok: false, message: friendlyError(error) };
    updateTag(TOURS_TAG);
    return { ok: true, message: parsed.data.published ? "Saved. The live site is updated." : "Saved as a draft (not visible on the site)." };
  }

  // New tours go to the end of the list.
  const { data: last } = await supabase.from("tours").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await supabase
    .from("tours")
    .insert({ ...parsed.data, sort_order: (last?.sort_order ?? 0) + 10 })
    .select("id")
    .single();
  if (error) return { ok: false, message: friendlyError(error) };

  updateTag(TOURS_TAG);
  redirect(`/admin/tours/${data.id}/?created=1`);
}

export async function deleteTour(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").delete().eq("id", id);
  updateTag(TOURS_TAG);
  redirect("/admin/");
}

export async function setPublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").update({ published }).eq("id", id);
  updateTag(TOURS_TAG);
}

/** Swap a tour with its neighbour to move it up or down the list. */
export async function moveTour(id: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin();
  const { data: all } = await supabase.from("tours").select("id, sort_order").order("sort_order").order("created_at");
  if (!all) return;

  const i = all.findIndex((t) => t.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return;

  // Re-number everything so ties can't block a move.
  const order = all.map((t) => t.id);
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((tid, k) => supabase.from("tours").update({ sort_order: (k + 1) * 10 }).eq("id", tid)));
  updateTag(TOURS_TAG);
}

function friendlyError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Another package already uses this URL slug. Choose a different one.";
  if (error.code === "42501") return "You don't have permission to do that.";
  return `Could not save: ${error.message}`;
}
