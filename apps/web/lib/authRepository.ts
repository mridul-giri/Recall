import { IdentityType, prisma } from "@repo/db";

export async function findUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function findIdentityByProvider(
  provider: IdentityType,
  providerId: string,
) {
  return await prisma.identity.findFirst({
    where: { provider, providerId },
  });
}

export async function createIdentity(
  provider: IdentityType,
  providerId: string,
  userId: string,
) {
  return await prisma.identity.create({
    data: { provider, providerId, userId },
  });
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string | null; email?: string | null },
) {
  return await prisma.user.update({ where: { id: userId }, data });
}

export async function markLinkTokenUsed(tokenId: string) {
  return await prisma.linkToken.update({
    where: { id: tokenId },
    data: { isUsed: true },
  });
}

export async function createUserWithIdentity(
  name: string | null | undefined,
  email: string | null | undefined,
  provider: IdentityType,
  providerId: string,
) {
  return await prisma.user.create({
    data: {
      name,
      email,
      identities: {
        create: { provider, providerId },
      },
    },
  });
}

export async function findActiveStatusByUserId(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });
}
