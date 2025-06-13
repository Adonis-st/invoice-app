import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { auth } from "./auth";

export default {
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  callbacks: {
    authorized: async () => {
      const session = await auth();
      // Logged in users are authenticated, otherwise redirect to login page
      if (session) {
        redirect(`/${session.user?.id}`);
      } else {
        redirect("/sign-in");
      }
    },
  },
} satisfies NextAuthConfig;
