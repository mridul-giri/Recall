import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { config } from "../utils/config";
import { IdentityType } from "@repo/db";
import { cookies } from "next/headers";
import {
  findUserById,
  findActiveStatusByUserId,
  findIdentityByProvider,
  createIdentity,
  createUserWithIdentity,
  updateUserProfile,
  markLinkTokenUsed,
} from "./authRepository";

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
        const existingUser = await findUserById(userId);
        if (!existingUser) return false;

        const existingIdentity = await findIdentityByProvider(
          IdentityType.google,
          account.providerAccountId,
        );
        if (existingIdentity) return false;

        await createIdentity(
          IdentityType.google,
          account.providerAccountId,
          userId,
        );

        await updateUserProfile(userId, {
          name: user.name,
          email: user.email,
        });

        await markLinkTokenUsed(tokenId);

        cookieStore.delete("linkingSession");
        return true;
      }

      const existingIdentity = await findIdentityByProvider(
        IdentityType.google,
        account.providerAccountId,
      );
      if (existingIdentity) return true;

      await createUserWithIdentity(
        user.name,
        user.email,
        IdentityType.google,
        account.providerAccountId,
      );

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const identity = await findIdentityByProvider(
          IdentityType.google,
          account.providerAccountId,
        );

        if (identity) {
          const dbUser = await findActiveStatusByUserId(identity.userId);
          if (!dbUser || dbUser.isActive == false) {
            return {};
          }
          token.userId = identity.userId;
        }
        return token;
      }

      if (token.userId && typeof token.userId === "string") {
        const dbUser = await findActiveStatusByUserId(token.userId);
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
  pages: {
    signIn: "/auth/register",
  },
};
