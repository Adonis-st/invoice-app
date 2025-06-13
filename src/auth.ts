import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { redirect } from "next/navigation";
import { prisma } from "./server/db";
import { cache } from "react";
import authConfig from "./auth.config";

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [Google],
//   callbacks: {
//     authorized: async ({ auth }) => {
//       // Logged in users are authenticated, otherwise redirect to login page
//       if (auth) {
//         redirect(`/${auth.user?.id}`);
//       } else {
//         redirect("/sign-in");
//       }
//     },
//   },
// });

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
