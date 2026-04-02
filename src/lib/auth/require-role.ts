import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/get-profile";

export async function requireRole(roles: Array<"customer" | "seller" | "admin">) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!roles.includes(profile.role)) {
    redirect("/");
  }

  return profile;
}