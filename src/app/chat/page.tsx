import { createChat } from "@/lib/chat";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import 'server-only'


export default async function chatPage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/")
    }
    const chatId = await createChat(session?.user?.id)
    redirect(`/chat/${chatId}`)
}