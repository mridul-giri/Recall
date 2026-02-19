import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../utils/config";
import { IdentityType, prisma } from "@repo/db";
import { cookies } from "next/headers";

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
      const cookieStore = await cookies();
      const cookie = cookieStore.get("linkingSession");

      let userId: string | undefined;
      let tokenId: string | undefined;

      if (cookie?.value) {
        ({ userId, tokenId } = JSON.parse(cookie.value));
      }

      if (!account) return false;

      if (tokenId && userId) {
        const existingUser = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!existingUser) return false;

        const existingIdentity = await prisma.identity.findFirst({
          where: {
            provider: IdentityType.google,
            providerId: account.providerAccountId,
          },
        });
        if (existingIdentity) return false;

        await prisma.identity.create({
          data: {
            provider: IdentityType.google,
            providerId: account.providerAccountId,
            userId,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name: user.name,
            email: user.email,
          },
        });

        await prisma.linkToken.update({
          where: {
            id: tokenId,
          },
          data: {
            isUsed: true,
          },
        });

        cookieStore.delete("linkingSession");
        return true;
      }

      const existingIdentity = await prisma.identity.findFirst({
        where: {
          provider: IdentityType.google,
          providerId: account.providerAccountId,
        },
      });
      if (existingIdentity) return true;

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

        if (identity) {
          const dbUser = await prisma.user.findUnique({
            where: { id: identity?.userId },
            select: { isActive: true },
          });
          if (!dbUser || dbUser.isActive == false) {
            return {};
          }
          token.userId = identity.userId;
        }
        return token;
      }

      if (token.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId },
          select: { isActive: true },
        });
        if (!dbUser || dbUser.isActive == false) {
          return {};
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/register",
  // },
};
