"use client";

import { useState } from "react";
import { FaEnvelope, FaPaperPlane, FaRegFileAlt } from "react-icons/fa";
import axios from "axios";

type EmailDraftCardProps = {
  to: string;
  subject: string;
  body: string;
};

export function EmailDraftCard({
  to,
  subject,
  body,
}: EmailDraftCardProps) {
  const [recipient, setRecipient] = useState(to);
  const [emailSubject, setEmailSubject] = useState(subject);
  const [emailBody, setEmailBody] = useState(body);

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSendEmail = async () => {
    try {
      const confirmed = window.confirm(`Send this email to ${recipient}`)

      if (!confirmed) {
        return
      }

      setIsSending(true)
      setStatusMessage("")
      setHasError(false)
      const response = await axios.post("/api/email/send", {
        to: recipient.trim(),
        subject: emailSubject.trim(),
        body: emailBody.trim(),
        confirmed: true
      })

      setStatusMessage(JSON.stringify(response.data.message , null , 2))
      setHasError(false)
    } catch (error) {
      if(axios.isAxiosError(error)){
        const apierror = error.response?.data

        if(apierror && typeof apierror === "object" && "error" in apierror && typeof apierror.error === "string") {
          setStatusMessage(apierror.error)
        }
      }
      setHasError(true)
    } finally {
      setIsSending(false)
    }
  }

  const inputStyle = "w-full rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="mt-5 w-full max-w-2xl overflow-hidden rounded-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
            <FaEnvelope size={17} />
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-gray-900">
              New message
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Ready to review and send
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5 p-5 sm:p-6">

        {/* Recipient */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">To</span>
            To
          </label>

          <input
            type="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            placeholder="recipient@example.com"
            className={inputStyle}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">S</span>
            Subject
          </label>

          <input
            value={emailSubject}
            onChange={(event) => setEmailSubject(event.target.value)}
            placeholder="Enter email subject"
            className={inputStyle}
          />
        </div>

        {/* Message */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaRegFileAlt className="text-slate-400" size={13} />
              Message
            </label>

            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium tabular-nums text-slate-500">
              {emailBody.length} characters
            </span>
          </div>

          <textarea
            value={emailBody}
            onChange={(event) => setEmailBody(event.target.value)}
            rows={7}
            placeholder="Write your message here..."
            className={`${inputStyle} min-h-44 resize-y leading-7`}
          />
        </div>

        {/* Footer Note */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
          <FaRegFileAlt
            className="mt-0.5 shrink-0 text-blue-600"
            size={15}
          />

          <p className="text-xs leading-5 text-slate-600">
            <span className="font-semibold text-slate-800">
              Review before sending.
            </span>{" "}
            Make sure the recipient, subject, and message are correct.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSendEmail}
          disabled={isSending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <FaPaperPlane size={13} />
          {isSending ? "Sending email..." : "Send email"}
        </button>

        {statusMessage && (
          <pre
            role="status"
            className={
              hasError
                ? "whitespace-pre-wrap rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                : "whitespace-pre-wrap rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            }
          >
            {statusMessage}
          </pre>
        )}

      </div>
    </div>
  );
}
