import type { NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabase } from "@/lib/supabase/env";

/**
 * Called once a day by Vercel Cron (see vercel.json) so the free Supabase project
 * never looks inactive and gets paused. The site caches tour data, so normal visits
 * alone may not reach Supabase for days.
 */
export async function GET(request: NextRequest) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!hasSupabase) return Response.json({ ok: false, reason: "Supabase not configured" }, { status: 500 });

  const { error } = await createPublicClient().from("tours").select("id").limit(1);
  if (error) return Response.json({ ok: false, reason: error.message }, { status: 500 });

  return Response.json({ ok: true, at: new Date().toISOString() });
}
