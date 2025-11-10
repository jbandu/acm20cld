import { Role } from "@prisma/client";
import { auth } from "./auth-config";

export type Permission =
  | "query:create"
  | "query:read"
  | "query:delete"
  | "feedback:create"
  | "knowledge:contribute"
  | "knowledge:approve"
  | "team:view"
  | "analytics:view"
  | "user:manage"
  | "system:configure"
  | "sources:manage";

const rolePermissions: Record<Role, Permission[]> = {
  RESEARCHER: [
    "query:create",
    "query:read",
    "query:delete",
    "feedback:create",
    "knowledge:contribute",
  ],
  MANAGER: [
    "query:create",
    "query:read",
    "query:delete",
    "feedback:create",
    "knowledge:contribute",
    "knowledge:approve",
    "team:view",
    "analytics:view",
  ],
  ADMIN: [
    "query:create",
    "query:read",
    "query:delete",
    "feedback:create",
    "knowledge:contribute",
    "knowledge:approve",
    "team:view",
    "analytics:view",
    "user:manage",
    "system:configure",
    "sources:manage",
  ],
};

export async function hasPermission(permission: Permission): Promise<boolean> {
  const session = await auth();

  if (!session) {
    return false;
  }

  const userPermissions = rolePermissions[session.user.role];
  return userPermissions.includes(permission);
}

export async function requirePermission(permission: Permission): Promise<void> {
  const allowed = await hasPermission(permission);

  if (!allowed) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

export function canManageUsers(role: Role): boolean {
  return role === "ADMIN";
}

export function canApproveContributions(role: Role): boolean {
  return role === "MANAGER" || role === "ADMIN";
}

export function canViewTeamActivity(role: Role): boolean {
  return role === "MANAGER" || role === "ADMIN";
}
