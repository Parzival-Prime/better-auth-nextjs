import ReturnButton from "@/components/ReturnButton";

interface PageProps {
    searchParams: Promise<{error: string}>
}

async function page({searchParams}: PageProps) {
    const sp = await searchParams

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />
        <h1 className="text-3xl font-bold">Login Error</h1>
      </div>

        <p className="text-destructive">
            {sp.error === "account_not_linked"
            ? "This account is already linked to another signed in method."
            : "Oops! Something went wrong. Please try again."}
        </p>
    </div>
  );
}

export default page;
