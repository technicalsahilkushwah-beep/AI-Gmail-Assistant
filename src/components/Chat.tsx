"use client";
import { useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { EmailDraftCard } from "./email-draft-card";
import { ArrowUp, Bot, Sparkles, UserRound } from "lucide-react";
import { DefaultChatTransport } from 'ai'

export default function Chat({ Id, initialMessages }: { Id: string, initialMessages: UIMessage[] }) {
    const [input, setInput] = useState("");

    const { messages, sendMessage } = useChat({
        id: Id,
        messages: initialMessages,

        transport: new DefaultChatTransport({
            api: "/api/chat",

            prepareSendMessagesRequest: ({ id, messages }) => {
                const apiKey = localStorage.getItem("gemini_api_key");

                return {
                    body: {
                        id,
                        messages,
                        apiKey
                    }
                }

            }
        })
    })

    const handleSubmit = async () => {

        const userQuery = input.trim()

        if (!userQuery) {
            return
        }

        await sendMessage({
            text: userQuery
        })
        setInput("")
    }

    return (
        <main className="flex h-full min-h-0 w-full flex-1 flex-col bg-[radial-gradient(ellipse_at_top,_#eff6ff_0%,_#f8fafc_42%,_#f8fafc_100%)]">
            <section
                aria-label="Chat messages"
                className="min-h-0 flex-1 overflow-y-auto px-4 py-7 sm:px-6 lg:px-10"
            >
                <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6">
                    {messages.length === 0 && (
                        <div className="m-auto max-w-md rounded-3xl px-7 py-9 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25">
                                <Sparkles size={22} />
                            </div>
                            <span className="mt-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                                Email copilot
                            </span>
                            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                                What would you like to write?
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Tell me the recipient and what you want to say. I&apos;ll prepare a polished email draft.
                            </p>
                        </div>
                    )}

                    {messages.map((message) => {
                        const hasDraft = message.parts.some(
                            (part) => part.type === "tool-generateEmailDraft" && part.state === "output-available"
                        );

                        return (
                            <div
                                key={message.id}
                                className={`w-fit max-w-[88%] sm:max-w-[78%] ${hasDraft ? "max-w-2xl" : ""} ${message.role === "user" ? "self-end" : "self-start"}`}
                            >
                                <div className={`rounded-2xl px-4 py-3.5 shadow-sm ${message.role === "user"
                                    ? "rounded-br-md bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-600/15"
                                    : hasDraft
                                        ? "p-0 shadow-none"
                                        : "rounded-bl-md border border-slate-200/90 bg-white/95 text-slate-800 shadow-slate-200/60"
                                    }`}>
                                    <p className={`mb-2 flex items-center gap-1.5 text-xs font-semibold ${message.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                                        {message.role === "user" ? <UserRound size={12} /> : <Bot size={13} />}
                                        {message.role === "user" ? "You" : "Email Assistant"}
                                    </p>

                                    {message.parts.map((part, index) => {
                                        if (part.type === "text") {
                                            return (
                                                <p
                                                    key={`${message.id}-${index}`}
                                                    className="whitespace-pre-wrap text-[15px] leading-6"
                                                >
                                                    {part.text}
                                                </p>
                                            );
                                        }

                                        if (part.type === "tool-generateEmailDraft" && part.state === "output-available") {
                                            const draft = part.output

                                            if (typeof draft === "object" && draft !== null && "type" in draft && draft.type === "email_draft" && "to" in draft && "subject" in draft && "body" in draft && typeof draft.to === "string" && typeof draft.subject === "string" && typeof draft.body === "string") {
                                                return (
                                                    <div key={`${message.id}-${index}`} className="pt-4">
                                                        <EmailDraftCard to={draft.to} subject={draft.subject} body={draft.body} />
                                                    </div>
                                                )
                                            }
                                        }
                                        return null
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            <div className=" px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
                <form
                    className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 pl-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-shadow focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleSubmit();
                    }}
                >
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Ask me to write an email..."
                        aria-label="Your message"
                        className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim()}
                        aria-label="Send message"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                        <ArrowUp size={19} strokeWidth={2.5} />
                    </button>
                </form>
            </div>
        </main>
    );
}
