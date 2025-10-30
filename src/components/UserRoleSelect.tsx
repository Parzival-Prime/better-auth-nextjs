"use client"

import { UserRole } from "@/generated/prisma/enums"
import { admin } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface UserRoleSelectProps {
    userId: string
    role: UserRole
}

function UserRoleSelect({userId, role}: UserRoleSelectProps) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleChange = async(e: React.ChangeEvent<HTMLSelectElement>)=>{
      const newRole = e.target.value as UserRole

      const canChangeRole = await admin.hasPermission({
        permissions: {
          user: ["set-role"]
        }
      })

      if(!canChangeRole.data?.success){
        return toast.error("FORBIDDEN")
      }

      await admin.setRole({
        userId,
        role: newRole,
        fetchOptions: {
          onRequest: ()=>{
            setIsPending(true)
          },
          onResponse: ()=>{
            setIsPending(false)
          },
          onError: (ctx)=>{
            toast.error(ctx.error.message)
          },
          onSuccess: ()=>{
            toast.success("Use role updated")
            router.refresh()
          }
        }
      })
    }

  return (
    <select
    value={role}
    onChange={handleChange}
    disabled={role === "ADMIN" || isPending}
    className="px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="ADMIN">ADMIN</option>
      <option value="USER">USER</option>
    </select>
  )
}

export default UserRoleSelect
