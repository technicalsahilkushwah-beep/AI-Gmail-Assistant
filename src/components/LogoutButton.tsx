"use client"
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {

  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({
      redirect:true,
      redirectTo: "/"
    })
  }
  return (
    <button onClick={handleSignOut}
      type="button"
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
    >
      <LogOut size={17} strokeWidth={1.8} />
      Logout
    </button>
  );
}
