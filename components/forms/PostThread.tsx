"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
// import { updateUser } from "@/lib/actions/user.actions";

interface Props {
    user: {
        id: string;
        objectID: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}


function PostThread({ userId }: { userId: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        },
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname,
        })

        router.push("/")
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10 "
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl
                                className="no-focus border-dark-4 bg-dark-3 text-light-1"
                            >
                                <Textarea
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">
                        Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread