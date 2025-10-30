"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInEmailAction } from "@/actions/sign-in-email.action";

function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target as HTMLFormElement);

    //============ Client Side Auth ============//   ( Recommended )

    const email = String(formData.get("email"));
    if (!email) return toast.error("Please enter your email");

    const password = String(formData.get("password"));
    if (!password) return toast.error("Please enter your password");

    await signIn.email(
      { email, password },
      {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          router.push("/profile");
          toast.success("Logged In Successful.  \n Good to have you back 😊");
        },
      }
    );

    //=========== Server Side Auth =========//

    // const {error} = await signInEmailAction(formData)

    // if(error){
    //   toast.error(error)
    //   setIsPending(false)
    // } else {
    //   router.push("/profile");
    //   toast.success("Logged In Successful.  \n Good to have you back 😊");
    // }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full sapce-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" />

        <Label htmlFor="password">Password:</Label>
        <Input type="password" id="password" name="password" />

        <Button type="submit" className="w-full" disabled={isPending}>
          Login
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
