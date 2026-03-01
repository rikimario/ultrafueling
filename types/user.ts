import { User as SupabaseUser } from "@supabase/supabase-js";

// Extend Supabase User if needed
export interface User extends SupabaseUser {
  full_name?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  subscribed_at: string | null;
  cancel_at: string | null;
}
