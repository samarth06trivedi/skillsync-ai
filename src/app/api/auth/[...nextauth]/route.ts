//api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import users from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider for social login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider for custom email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own DB authentication logic
        const user = await users.findOne({ email: credentials?.email });
        if (user && await bcrypt.compare(credentials!.password, user.password)) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
        }
        // Return null to indicate failed login
        return null;
      },
    }),
  ],

  // Custom sign-in page
  pages: {
    signIn: "/auth",
  },

  // Use JWT strategy
  session: {
    strategy: "jwt",
  },

  // Required secret for signing JWTs
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
