import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "@/config/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { signIn, signOut, auth, handlers } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: "Ai_Gmail_Assistant",
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session;
    },
  },
});
