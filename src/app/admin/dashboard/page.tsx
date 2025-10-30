import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/DeleteUserButton";
import ReturnButton from "@/components/ReturnButton";
import UserRoleSelect from "@/components/UserRoleSelect";
import { UserRole } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profile" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="p-2 rounded-md text-lg bg-red-700 text-white font-bold">
            FORBIDDEN
          </p>
        </div>
      </div>
    );
  }

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name"
    }
  }) 

  const sortedUsers = users.sort((a, b)=> {
    if(a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if(a.role !== "ADMIN" && b.role === "ADMIN") return 1;
    return 0
  })

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/profile" label="Profile" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="p-2 rounded-md text-lg bg-green-700 text-white font-bold">
          ACCESS GRANTED
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap">
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2 text-center">Role</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">
                  <UserRoleSelect userId={user.id} role={user.role as UserRole} />
                </td>
                <td className="px-4 py-2 text-center">
                  {user.role === "ADMIN" || user.id === session.user.id ? (
                    <PlaceholderDeleteUserButton />
                  ) : (
                    <DeleteUserButton userId={user.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default page;
