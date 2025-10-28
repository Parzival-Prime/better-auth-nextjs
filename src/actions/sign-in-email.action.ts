"use server";

//=========== Server Side Auth ===========//

// Recommended is Client Side

import { auth } from "@/lib/auth";
import { parseSetCookieHeader } from "better-auth/cookies";
import { cookies, headers } from "next/headers";

export async function signInEmailAction(formData: FormData) {

  const email = String(formData.get("email"));
  if (!email) return { error: "Please enter your email" };

  const password = String(formData.get("password"));
  if (!password) return { error: "Please enter your password" };

  try {
    const res = await auth.api.signInEmail({
        headers: await headers(),    // If we pass headers we will get some extra information in session
        body: { email, password },
        asResponse: true
    })

    // If we decide to implement server side auth, We will have to set cookies ourself
    // There are two ways to do this 
    // 1. More manual
    // 2. Less manual

    // This is more manual way, in less one we just have to set 'nextCookies()' plugin in auth.ts
    // const setCookieHeader = res.headers.get('set-cookie')   
    // if(setCookieHeader){
    //     const cookie = parseSetCookieHeader(setCookieHeader)
    //     const cookieStore = await cookies()

    //     const [key, cookieAttributes] = [...cookie.entries()][0]
    //     const value = cookieAttributes.value
    //     const maxAge = cookieAttributes["max-age"]
    //     const path = cookieAttributes.path
    //     const httpOnly = cookieAttributes.httponly
    //     const sameSite = cookieAttributes.samesite

    //     cookieStore.set(key, decodeURIComponent(value), {
    //         maxAge, path, httpOnly, sameSite
    //     })
    // }


    return {error: null }
  } catch (error) {
    if (error instanceof Error){
        return { error: "Oops Something went wrong while logging In user!" }
    }

    return {error: "internal server error"}
  }
}
