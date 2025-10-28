import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import ReturnButton from "@/components/ReturnButton";

async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <SignOutButton />

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

export default page;
