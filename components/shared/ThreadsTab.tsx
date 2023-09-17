import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface Props {
    currentUserId: string
    accountId: string
    accountType: string
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let results: any
    if (accountType === 'Community')  {
        results = await fetchCommunityPosts(accountId)   
    } else {
        results = await fetchUserPosts(accountId)
    }
    if (!results) redirect("/")

    return (
        <section className="mt-9 flex flex-col gap-10">
            {results.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId }
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User' 
                        ? { name: results.name, image: results.image, id: results.id}
                        : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
                    }
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab