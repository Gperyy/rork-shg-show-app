import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          apple_user_id: string | null;
          onesignal_player_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          apple_user_id?: string | null;
          onesignal_player_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          apple_user_id?: string | null;
          onesignal_player_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          notification_id: string | null;
          notification_title: string | null;
          campaign_name: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          notification_id?: string | null;
          notification_title?: string | null;
          campaign_name?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          notification_id?: string | null;
          notification_title?: string | null;
          campaign_name?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      user_activity: {
        Row: {
          user_id: string;
          last_opened_at: string;
          last_ticket_viewed_at: string | null;
          session_count: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          last_opened_at?: string;
          last_ticket_viewed_at?: string | null;
          session_count?: number;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          last_opened_at?: string;
          last_ticket_viewed_at?: string | null;
          session_count?: number;
          created_at?: string;
        };
      };
    };
  };
}
