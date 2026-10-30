"use client"
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiGmail } from "react-icons/si";

type ResponseData = {
  connected: boolean,
  account: string
}

export default function GmailConnectButton() {
  const [data , setData] = useState<ResponseData | null>(null)
  const getEmail = async () => {
    const email = await axios.get("/api/gmail/status")
    setData(email.data)
  }

  useEffect(() => {
    getEmail()
  },[])
  return (
    <button onClick={() => window.location.href=`/api/auth/google?returnTo=${encodeURIComponent(window.location.pathname)}`}
      type="button"
      className="flex items-center cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2 transition-colors hover:bg-slate-50"
    >
      <SiGmail className="h-6 w-6 shrink-0 text-red-400" />

      <div className="hidden min-w-0 text-left sm:block">
        <p className="text-sm font-semibold text-slate-900">
          Gmail {data?.connected ? "Connected" : "Disconnect"}
        </p>
        <p className="max-w-[210px] truncate text-xs text-slate-500">
          {data?.account}
        </p>
      </div>

      <ChevronDown
        size={17}
        className="shrink-0 text-slate-500"
      />
    </button>
  );
}
