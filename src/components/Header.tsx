
import { Mail } from "lucide-react";
import GmailConnectButton from './GmailConnectButton'
import LogoutButton from './LogoutButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="flex min-h-[84px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Logo and Brand */}
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
            <Mail
              size={28}
              className="text-white"
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-[22px]">
              AI Gmail Assistant
            </h1>

            <p className="hidden text-sm text-slate-500 sm:block">
              Your AI-powered email writing assistant
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <GmailConnectButton />

          <div className="hidden h-9 w-px bg-slate-200 sm:block" />

          {/* Profile Avatar */}
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700 sm:flex">
            S
          </div>

          <LogoutButton />
        </div>

      </div>
    </header>
  );
}
