import PostThread from "@/components/forms/PostThread"
import { fetchUsser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

async function Page() {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUsser(user.id)

    if (!userInfo?.onboarded) redirect('/onboarding')

    return (
        <>
        <h1 className="head-text">
            Create Thread
        </h1>

        <PostThread userId={userInfo._id} />
        </>
    )
}

export default Page