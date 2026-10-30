
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";


export default function GeminiApiSettings({
  onClose,
}: {
  onClose: () => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasSavedApiKey, setHasSavedApiKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");

    setHasSavedApiKey(Boolean(savedKey));
  }, []);

  const handleSaveApiKey = () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setStatusMessage("Please enter your Gemini API key.");
      return;
    }

    try {
      localStorage.setItem("gemini_api_key", trimmedKey);
      setHasSavedApiKey(true);
      setApiKey("");
      setStatusMessage("Gemini API key saved successfully!");
    } catch {
      setStatusMessage("Unable to save API key in this browser.");
    }
  };


  const handleRemoveApiKey = () => {
    localStorage.removeItem("gemini_api_key");

    setApiKey("");
    setHasSavedApiKey(false);
    setStatusMessage("Gemini API key removed successfully!");
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KeyRound className="text-blue-600" size={22} />
            <h2 className="text-lg font-semibold text-slate-900">
              Gemini API Settings
            </h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={21} />
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Gemini API Key
        </label>

        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Enter your Gemini API key"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showKey ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Add your own Gemini API key to use your personal AI access.
        </p>

        <div className="mt-6 flex gap-3">
          <button onClick={handleSaveApiKey}
            type="button"
            disabled={!apiKey.trim()}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save API Key
          </button>

          <button onClick={handleRemoveApiKey}
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
        <a
          href="https://aistudio.google.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          <KeyRound size={18} />
          Get Gemini API Key
        </a>
        {statusMessage && (
          <p
            role="status"
            className="mt-3 text-sm text-green-700"
          >
            {statusMessage}
          </p>
        )}
        {hasSavedApiKey && (
          <p className="mt-2 text-sm font-medium text-green-700">
            ✓ Gemini API key is saved
          </p>
        )}
      </div>
    </div>
  );
}
