import NextAuth, { NextAuthConfig } from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import google from "next-auth/providers/google";
import { createStripeCustomer } from "@/lib/stripe";

// console.log(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config: NextAuthConfig = {
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL ?? "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
  basePath: "/api/auth",
  callbacks: {
    authorized({ request, auth }) {
      try {
        const { pathname } = request.nextUrl;
        if (pathname === "protected-page") return !!auth;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    jwt({ token, trigger, session }) {
      if (trigger == "update") token.name = session.user.name;
      return token;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
