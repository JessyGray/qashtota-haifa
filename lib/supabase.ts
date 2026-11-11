"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
// Returns null until the Supabase env vars are set, so pages can show a "not ready" state.
export function supabase() {
  if (!url || !key) return null;
  return (client ??= createClient(url, key));
}
