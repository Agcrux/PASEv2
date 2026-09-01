import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

/**
 * Landing route. Sends logged-in users to their home, everyone else to login.
 * TODO(Part A): confirm redirect targets once auth flow is finalized.
 */
export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}
