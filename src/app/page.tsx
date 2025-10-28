import GetStartedButton from "@/components/GetStartedButton"

function page() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 items-center flex-col">
        <h1 className="text-6xl font-bold">Better Auth</h1>

        <GetStartedButton />
      </div>
    </div>
  )
}

export default page
