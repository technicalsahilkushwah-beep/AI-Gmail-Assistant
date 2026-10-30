"use client"
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewChatButton() {
  const router = useRouter()
  const handleCreateNewChat = async () => {
    const chatId = await axios.post("/api/chat/chats")
    router.refresh()
    router.push(`http://localhost:3000/chat/${chatId.data.chatId}`)
  }
  return (
    <button onClick={handleCreateNewChat}
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700"
    >
      <Plus size={20} strokeWidth={2} />
      <span>New Chat</span>
    </button>
  );
}
