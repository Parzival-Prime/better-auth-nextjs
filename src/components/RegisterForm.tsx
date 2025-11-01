"use client";

import { signUp } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpEmailAction } from "@/actions/sign-up-email.action";

function RegisterForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false) 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true)
    const formData = new FormData(e.target as HTMLFormElement);


    //========= Client Side Auth =======//   ( Recommended )

    const name = String(formData.get("name")) || "";

    const username = String(formData.get("username"))|| "";

    const email = String(formData.get("email"));
    if (!email) return toast.error("Please enter your email");

    const password = String(formData.get("password"));
    if (!password) return toast.error("Please enter your password");

    await signUp.email({name: name, username: username, email: email, password: password},
      {
        onRequest: ()=>{setIsPending(true)},
        onResponse: ()=>{setIsPending(false)},
        onError: (ctx)=>{
          toast.error(ctx.error.message)
        },
        onSuccess: ()=>{
          router.push("/profile")
          toast.success("Registration Successful. Sent you the Verification Email")
        }
      }
    )



    //========= Server Side Auth ==========// 

    // const {error} = await signUpEmailAction(formData)

    // if(error){
    //   toast.error(error)
    //   setIsPending(false)
    // } else {
    //   router.push("/profile")
    //   toast.success("Registration Successful. You're all set 👍")
    // }

  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full sapce-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name:</Label>
        <Input type="text" id="name" name="name" />

        <Label htmlFor="username">Username:</Label>
        <Input type="text" id="username" name="username" />

        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" />

        <Label htmlFor="password">Password:</Label>
        <Input type="password" id="password" name="password" />

        <Button type="submit" className="w-full" disabled={isPending}>
          Register
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
