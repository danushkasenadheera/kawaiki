export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until Supabase env vars are set; the public site then falls back to data/tours.json. */
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const IMAGE_BUCKET = "tour-images";
