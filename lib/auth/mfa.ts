import { authenticator } from "otplib";
import { prisma } from "@/lib/db/prisma";

export async function generateMFASecret(userId: string) {
  const secret = authenticator.generateSecret();

  await prisma.user.update({
    where: { id: userId },
    data: {
      mfaSecret: secret,
    },
  });

  return secret;
}

export function generateQRCodeUrl(email: string, secret: string): string {
  return authenticator.keyuri(email, "ACM Research Platform", secret);
}

export async function enableMFA(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true },
  });

  if (!user?.mfaSecret) {
    throw new Error("MFA secret not found. Please generate a secret first.");
  }

  const isValid = authenticator.verify({
    token,
    secret: user.mfaSecret,
  });

  if (!isValid) {
    throw new Error("Invalid verification code");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      mfaEnabled: true,
    },
  });

  return true;
}

export async function disableMFA(userId: string, password: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const bcrypt = require("bcryptjs");
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      mfaEnabled: false,
      mfaSecret: null,
    },
  });
}

export function verifyMFAToken(secret: string, token: string): boolean {
  return authenticator.verify({ token, secret });
}
