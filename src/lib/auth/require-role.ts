import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/get-profile";

type Role = "customer" | "seller" | "admin";

type Profile = {
  role?: Role | null;
};

export async function requireRole(roles: Role[]) {
  const profile = (await getProfile()) as Profile | null;

  if (!profile) {
    redirect("/login");
  }

  const role = profile.role;

  if (!role || !roles.includes(role)) {
    redirect("/");
  }

  return profile;
}
