import { createClient as _createClient, SupabaseClient } from "@supabase/supabase-js";
import Env from "./env.config";

export function createClient(): SupabaseClient {
    return _createClient(Env.SUPABASE_URL, Env.SUPABASE_SECRET_KEY);
}
