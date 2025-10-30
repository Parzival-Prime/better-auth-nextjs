import RegisterForm from "@/components/RegisterForm";
import ReturnButton from "@/components/ReturnButton";
import SignInOAuthButton from "@/components/SignInOAuthButton";
import Link from "next/link";

function page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Register</h1>
      </div>

      <div className="space-y-4">
      <RegisterForm />
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link href={"/auth/login"} className="hover:text-foreground">
            Login
          </Link>
        </p>
      </div>

      <hr className="max-w-sm" />

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOAuthButton provider={"google"} signUp={true} />
        <SignInOAuthButton provider={"github"} signUp={true} />
      </div>
    </div>
  );
}

export default page;
