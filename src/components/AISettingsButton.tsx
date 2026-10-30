
"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import GeminiApiSettings from "./GeminiApiSettings";

export default function AISettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
      >
        <Settings size={20} />
        AI Settings
      </button>

      {isOpen && (
        <GeminiApiSettings onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
