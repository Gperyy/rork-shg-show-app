import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../create-context";

// Supabase will be imported on the server side only
let supabase: any;

// Initialize Supabase client (server-side only)
if (typeof window === "undefined") {
  const { createClient } = require("@supabase/supabase-js");
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  console.log("🔧 Supabase Config:", {
    url: supabaseUrl ? "✅ Set" : "❌ Missing",
    key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
  });

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase client initialized");
  } else {
    console.warn("⚠️ Supabase not configured - missing environment variables");
  }
}

export const userRouter = createTRPCRouter({
  // Register a new user
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("📝 Register mutation called with:", {
        name: input.name,
        email: input.email,
        phone: input.phone,
      });

      if (!supabase) {
        console.error("❌ Supabase is not configured");
        throw new Error("Supabase is not configured");
      }

      console.log("💾 Attempting to insert into Supabase...");

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: input.name,
            email: input.email,
            phone: input.phone || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase error:", error);
        if (error.code === "23505") {
          // Unique constraint violation
          throw new Error("Email already registered");
        }
        throw new Error(error.message);
      }

      console.log("✅ User registered successfully:", data);
      return data;
    }),

  // Get user by email
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", input.email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found
          return null;
        }
        throw new Error(error.message);
      }

      return data;
    }),

  // Update user
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { id, ...updateData } = input;

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      if (!supabase) {
        throw new Error("Supabase is not configured");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", input.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null;
        }
        throw new Error(error.message);
      }

      return data;
    }),
});
