import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../utils/config";
import { IdentityType, prisma } from "@repo/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret: config.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;
      const existingIdentity = await prisma.identity.findFirst({
        where: {
          provider: IdentityType.google,
          providerId: account.providerAccountId,
        },
      });
      if (existingIdentity) return true;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email: user.email ?? undefined,
        },
      });
      if (userWithSameEmail) {
        await prisma.identity.create({
          data: {
            provider: IdentityType.google,
            providerId: account.providerAccountId,
            userId: userWithSameEmail.id,
          },
        });

        return true;
      }

      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          identities: {
            create: {
              provider: IdentityType.google,
              providerId: account.providerAccountId,
            },
          },
        },
      });

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const identity = await prisma.identity.findFirst({
          where: {
            provider: IdentityType.google,
            providerId: account.providerAccountId,
          },
        });

        if (identity) token.userId = identity.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/register",
  // },
};
