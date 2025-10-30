import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";
import ReturnButton from "@/components/ReturnButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    body: {
      userId: session?.user.id,
      permission: {
        posts: ["update", "delete"]
      }
    }
  })

  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button size="sm" asChild>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
        <SignOutButton />
      </div>

      <div className="text-2xl font-bold">Permissions</div>

        <div className="space-x-4">
          <Button size={"sm"}>MANAGE YOUR OWN POSTS</Button>
          <Button size={"sm"} disabled={!FULL_POST_ACCESS.success}>MANAGE ALL POSTS</Button>
        </div>

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

export default page;
