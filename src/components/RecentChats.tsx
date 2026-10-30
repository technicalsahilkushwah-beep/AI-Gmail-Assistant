"use client";

import { MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

type Chat = {
  chatId: string;
  title: string;
  updatedAt: string;
};

type RecentChatsProps = {
  chats: Chat[];
};

export default function RecentChats({ chats }: RecentChatsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleDeleteChat = async (chatId: string) => {
    try {
      await axios.delete("/api/chat/chats", { data: { chatId } });

      if (pathname === `/chat/${chatId}`) {
        router.push("/chat");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      window.alert("Unable to delete chat. Please try again.");
    }
  };

  return (
    <div className="mt-7">
      <h2 className="mb-3 px-4 text-sm font-semibold text-slate-600">
        Recent Chats
      </h2>

      {chats.length === 0 ? (
        <p className="px-4 py-3 text-sm text-slate-500">
          No chats yet. Start a new chat!
        </p>
      ) : (
        chats.map((chat) => {
          const isActive = pathname === `/chat/${chat.chatId}`;

          return (
            <div
              key={chat.chatId}
              className={`group flex w-full items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                isActive
                  ? "border-blue-100 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60"
                  : "border-transparent text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Link
                href={`/chat/${chat.chatId}`}
                aria-current={isActive ? "page" : undefined}
                className="flex min-w-0 flex-1 items-start gap-3 py-1 text-left"
              >
                <MessageCircle
                  size={20}
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                  }`}
                  strokeWidth={1.9}
                />

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${isActive ? "text-blue-900" : "text-slate-900"}`}>
                    {chat.title || "New Chat"}
                  </p>

                  <p className={`mt-1 text-xs ${isActive ? "text-blue-600/75" : "text-slate-500"}`}>
                    {new Date(chat.updatedAt).toLocaleDateString("en-GB", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => handleDeleteChat(chat.chatId)}
                aria-label={`Delete ${chat.title || "New Chat"}`}
                title="Delete chat"
                className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
