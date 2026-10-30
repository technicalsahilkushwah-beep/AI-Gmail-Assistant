import Link from "next/link";
import 'server-only'
import {
  FaEnvelope,
  FaPenToSquare,
  FaWandMagicSparkles,
  FaClock,
} from "react-icons/fa6";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { auth } from "../../auth";
import GoogleSignInModal from "@/components/GoogleSignInModal";

const Page = async () => {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-5 text-white">

      {/* Google Sign In - Top Right */}
      <header className="absolute right-5 top-5 z-10 sm:right-10 sm:top-8">
        <GoogleSignInButton />
      </header>

      {/* Main Content */}
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center py-24 text-center">

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
          <FaEnvelope className="text-xl text-gray-200" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          AI Gmail Assistant
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
          Write professional emails with AI.
          Create, improve, and manage your emails effortlessly.
        </p>

        <Link
          href="/chat"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium transition hover:bg-violet-500"
        >
          <FaPenToSquare />
          Start Writing
        </Link>

        <div className="mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:bg-white/[0.04]">
            <FaWandMagicSparkles className="mb-4 text-lg text-violet-400" />
            <h3 className="text-sm font-semibold">AI Email Writing</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Turn your ideas into clear, professional emails.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:bg-white/[0.04]">
            <FaEnvelope className="mb-4 text-lg text-violet-400" />
            <h3 className="text-sm font-semibold">Improve Emails</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Refine grammar, clarity, and writing tone.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:bg-white/[0.04]">
            <FaClock className="mb-4 text-lg text-violet-400" />
            <h3 className="text-sm font-semibold">Save Time</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Simplify everyday email writing with AI.
            </p>
          </div>

        </div>

        <p className="mt-12 text-xs text-gray-500">
          Simple emails. Smarter workflow.
        </p>
      </div>

      {/* Modal on top of the main UI */}
      {!isLoggedIn && <GoogleSignInModal open={true} />}

    </main>
  );
};

export default Page;
