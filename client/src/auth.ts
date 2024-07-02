/* 
  このファイルは、NextAuth の設定ファイルです。
  NextAuth は、認証に関する機能を提供します。
 */

import NextAuth, { NextAuthConfig } from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import google from "next-auth/providers/google";

import DB from "@/class/DB";

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
    async signIn({ user, account, profile }) {
      const db = new DB();
      const { id, name, email, image } = user;

      const { error } = await db.supabaseClient
        .from("profiles")
        .insert([{ id: id, name: name, email: email, image_url: image }]);

      console.log("signIn", user, account, profile);
      return true;
    },

    async authorized({ request, auth }) {
      const name = auth?.user?.name;

      console.log("authorized", name, request.nextUrl.pathname);
      try {
        const { pathname } = request.nextUrl;
        if (
          pathname === "/newchat" ||
          pathname === "/payment" ||
          pathname === "/forum"
        )
          return !!auth;
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
