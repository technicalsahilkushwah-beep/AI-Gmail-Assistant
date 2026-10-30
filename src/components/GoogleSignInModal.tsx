"use client";

import { useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import { FaXmark } from "react-icons/fa6";

type GoogleSignInModalProps = {
  open: boolean;
};

export default function GoogleSignInModal({
  open,
}: GoogleSignInModalProps) {

  const [isOpen, setIsOpen] = useState(open);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl"
      >

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close sign in modal"
        >
          <FaXmark className="text-xl" />
        </button>

        {/* Heading */}
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Sign in to continue
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          Sign in with your Google account to continue.
        </p>

        {/* Google Sign In */}
        <GoogleSignInButton />

      </div>
    </div>
  );
}