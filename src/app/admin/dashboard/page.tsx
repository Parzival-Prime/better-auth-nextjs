import ReturnButton from "@/components/ReturnButton";
import { auth } from "@/lib/auth";
import { useSession } from "@/lib/auth-client";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profile" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <p className="p-2 rounded-md text-lg bg-red-700 text-white font-bold">
            FORBIDDEN
        </p>
      </div>
    );
  }
}

export default page;
