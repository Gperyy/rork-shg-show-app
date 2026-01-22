import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../create-context";

// Helper to get Supabase client
const getSupabase = () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === "" || !supabaseAnonKey || supabaseAnonKey === "") {
    console.error("❌ Supabase config missing");
    return null;
  }

  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const notificationsRouter = createTRPCRouter({
  // OneSignal Player ID'yi kullanıcıya kaydet
  updatePlayerId: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid("Invalid user ID"),
        playerId: z.string().min(1, "Player ID is required"),
      })
    )
    .mutation(async ({ input }) => {
      const supabase = getSupabase();
      console.log("📱 Updating OneSignal Player ID:", {
        userId: input.userId,
        playerId: input.playerId.substring(0, 20) + "...",
      });

      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase
        .from("users")
        .update({ onesignal_player_id: input.playerId })
        .eq("id", input.userId)
        .select()
        .single();

      if (error) {
        console.error("❌ Player ID update error:", error);
        throw new Error(error.message);
      }

      console.log("✅ Player ID updated successfully");
      return { success: true, user: data };
    }),

  // Notification event kaydet (analytics için)
  trackEvent: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid().optional(),
        eventType: z.enum([
          "sent",
          "opened",
          "clicked_ticket",
          "purchase_yes",
          "purchase_no",
          "purchase_later",
        ]),
        notificationId: z.string().optional(),
        notificationTitle: z.string().optional(),
        campaignName: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const supabase = getSupabase();
      console.log("📊 Tracking notification event:", {
        eventType: input.eventType,
        campaignName: input.campaignName,
      });

      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase
        .from("notification_events")
        .insert([
          {
            user_id: input.userId || null,
            event_type: input.eventType,
            notification_id: input.notificationId || null,
            notification_title: input.notificationTitle || null,
            campaign_name: input.campaignName || null,
            metadata: input.metadata || {},
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Event tracking error:", error);
        throw new Error(error.message);
      }

      console.log("✅ Event tracked successfully");
      return { success: true, event: data };
    }),

  // Kullanıcı aktivitesini güncelle (uygulama açıldığında)
  updateActivity: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid("Invalid user ID"),
      })
    )
    .mutation(async ({ input }) => {
      const supabase = getSupabase();
      console.log("📈 Updating user activity:", input.userId);

      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      // Supabase function'ı çağır
      const { error } = await supabase.rpc("update_user_activity", {
        p_user_id: input.userId,
      });

      if (error) {
        // Eğer function yoksa manuel insert/update yap
        console.warn("⚠️ RPC failed, using manual upsert:", error.message);

        const { error: upsertError } = await supabase
          .from("user_activity")
          .upsert({
            user_id: input.userId,
            last_opened_at: new Date().toISOString(),
            session_count: 1,
          });

        if (upsertError) {
          console.error("❌ Activity update error:", upsertError);
          // Activity tracking kritik değil, hata fırlatmayalım
          return { success: false, error: upsertError.message };
        }
      }

      console.log("✅ Activity updated successfully");
      return { success: true };
    }),

  // Kampanya istatistiklerini getir
  getCampaignStats: publicProcedure
    .input(
      z.object({
        campaignName: z.string().min(1, "Campaign name is required"),
      })
    )
    .query(async ({ input }) => {
      const supabase = getSupabase();
      console.log("📊 Getting campaign stats:", input.campaignName);

      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      // Supabase function'ı çağır
      const { data, error } = await supabase.rpc("get_campaign_stats", {
        p_campaign_name: input.campaignName,
      });

      if (error) {
        console.error("❌ Campaign stats error:", error);
        throw new Error(error.message);
      }

      return data?.[0] || {
        total_sent: 0,
        total_opened: 0,
        total_clicked: 0,
        total_purchased: 0,
        open_rate: 0,
        click_rate: 0,
        conversion_rate: 0,
      };
    }),

  // Pasif kullanıcıları getir
  getInactiveUsers: publicProcedure
    .input(
      z.object({
        daysInactive: z.number().min(1).default(14),
      })
    )
    .query(async ({ input }) => {
      const supabase = getSupabase();
      console.log("👥 Getting inactive users:", input.daysInactive, "days");

      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      // Supabase function'ı çağır
      const { data, error } = await supabase.rpc("get_inactive_users", {
        days_inactive: input.daysInactive,
      });

      if (error) {
        console.error("❌ Inactive users error:", error);
        throw new Error(error.message);
      }

      return data || [];
    }),
});
