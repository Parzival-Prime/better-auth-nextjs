"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth-client"
import { useState } from "react"
import { toast } from "sonner"

interface SignInOAuthButtonProps {
    provider: "google" | "github"
    signUp?: boolean
}

function SignInOAuthButton({provider, signUp}: SignInOAuthButtonProps) {
    const [isPending, setIsPending] = useState(false)
  
    const action = signUp ? "Up" : "In"
    const providerName = provider === "google" ? "Google" : "GitHub"
  
    const handleClick = async()=>{
        await signIn.social({
            provider,
            callbackURL: "/profile",
            errorCallbackURL: "/auth/login/error",
            fetchOptions: {
                onRequest: ()=>{
                    setIsPending(true)
                },
                onResponse: ()=>{
                    setIsPending(false)
                },
                onError: (ctx)=>{
                    toast.error(ctx.error.message)
                }
            }
        })
    }

    return (
    <Button onClick={handleClick} disabled={isPending}>
      Sign {action} with {providerName}
    </Button>
  )
}

export default SignInOAuthButton
