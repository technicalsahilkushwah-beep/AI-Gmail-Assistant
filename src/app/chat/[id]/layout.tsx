import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default async function ChatLayout({children}:{children:React.ReactNode}) {
    return (
      <main className="flex h-dvh flex-col overflow-hidden bg-slate-50">
        <Header />
        <div className="flex min-h-0 flex-1">
            <Sidebar />
            {children}
        </div>
      </main>
    )
}
