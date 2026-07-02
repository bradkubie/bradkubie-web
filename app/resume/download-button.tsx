"use client";

export default function DownloadResumeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 3v10m0 0 4-4m-4 4-4-4M4 15v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" />
      </svg>
      Download PDF
    </button>
  );
}
