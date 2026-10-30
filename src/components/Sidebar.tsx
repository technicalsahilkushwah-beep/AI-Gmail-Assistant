import NewChatButton from "./NewChatButton";
import RecentChats from "./RecentChats";
import { auth } from "../../auth";
import { getAllchats } from "@/lib/chat";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import GeminiApiSettings from "./GeminiApiSettings";
import AISettingsButton from "./AISettingsButton";

export default async function Sidebar() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect("/")
  }

  const chats = await getAllchats(userId)
  const recentChats = chats.map(({ chatId, title, updatedAt }) => ({
    chatId,
    title,
    updatedAt: updatedAt.toISOString(),
  }))

  return (
    <aside className="hidden h-full w-72 shrink-0 flex-col px-4 py-5 md:flex">

      {/* New Chat */}
      <NewChatButton />

      {/* Divider */}
      <div className="mt-6 border-t border-slate-200" />

      {/* Recent Chats */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <RecentChats chats={recentChats} />
      </div>

      <AISettingsButton />

    </aside>
  );
}
