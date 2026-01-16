import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../create-context";

// Helper to get Supabase client
// Helper to get Supabase client
const getSupabase = (env: Record<string, string>) => {
  if (!env) return null;

  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase config missing in getSupabase:", {
      url: supabaseUrl ? "Set" : "Missing",
      key: supabaseAnonKey ? "Set" : "Missing"
    });
    return null;
  }

  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseAnonKey);
};

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
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabase(ctx.env);
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
    .query(async ({ input, ctx }) => {
      const supabase = getSupabase(ctx.env);
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
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabase(ctx.env);
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
    .query(async ({ input, ctx }) => {
      const supabase = getSupabase(ctx.env);
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

  // Register or login with Apple
  registerOrLoginWithApple: publicProcedure
    .input(
      z.object({
        appleUserId: z.string().min(1, "Apple user ID is required"),
        email: z.string().optional(), // Accept any string including empty
        fullName: z
          .object({
            givenName: z.string().optional(),
            familyName: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const supabase = getSupabase(ctx.env);
      console.log("🍎 Apple Sign In mutation called with:", {
        appleUserId: input.appleUserId,
        email: input.email,
        fullName: input.fullName,
      });

      if (!supabase) {
        console.error("❌ Supabase is not configured");
        throw new Error("Supabase is not configured");
      }

      // First, try to find existing user by apple_user_id
      console.log("🔍 Checking for existing Apple user...");
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("apple_user_id", input.appleUserId)
        .single();

      if (existingUser) {
        console.log("✅ Existing Apple user found:", existingUser);
        return existingUser;
      }

      // If no user found by apple_user_id, check by email (only if email is provided)
      let emailUser = null;
      if (input.email && input.email.trim() !== "") {
        console.log("🔍 Checking for existing user by email...");
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", input.email)
          .single();

        if (!error && data) {
          emailUser = data;
        }
      }

      if (emailUser) {
        // User exists with this email but no apple_user_id
        // Link the Apple ID to this user
        console.log("🔗 Linking Apple ID to existing user...");
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({ apple_user_id: input.appleUserId })
          .eq("id", emailUser.id)
          .select()
          .single();

        if (updateError) {
          console.error("❌ Error linking Apple ID:", updateError);
          throw new Error(updateError.message);
        }

        console.log("✅ Apple ID linked successfully:", updatedUser);
        return updatedUser;
      }

      // No existing user, create a new one
      console.log("👤 Creating new user with Apple Sign In...");

      // Construct name from fullName if provided
      let name = "Apple User";
      if (input.fullName) {
        const { givenName, familyName } = input.fullName;
        if (givenName && familyName) {
          name = `${givenName} ${familyName}`;
        } else if (givenName) {
          name = givenName;
        } else if (familyName) {
          name = familyName;
        }
      }

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: name,
            email: (input.email && input.email.trim() !== "") ? input.email : `apple_${input.appleUserId}@privaterelay.appleid.com`,
            apple_user_id: input.appleUserId,
            phone: null,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Supabase error:", insertError);
        if (insertError.code === "23505") {
          // Unique constraint violation
          throw new Error("User already registered");
        }
        throw new Error(insertError.message);
      }

      console.log("✅ User registered successfully with Apple:", newUser);
      return newUser;
    }),
});
