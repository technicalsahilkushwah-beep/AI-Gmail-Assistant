"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google" , {
        callbackUrl: "/chat"
      })}
      className="rounded-xl flex items-center gap-5 bg-white px-5 py-3 font-medium text-black hover:bg-gray-200 cursor-pointer transition duration-300"
    >
      <FcGoogle className="text-[20px]" />
      Continue with Google
    </button>
  );
}
