import type { Metadata } from "next";
import {
  education,
  experienceEntries,
  profile,
  skillGroups,
} from "../portfolio-content";
import DownloadResumeButton from "./download-button";

export const metadata: Metadata = {
  title: "Resume",
  description: "Downloadable resume for Bradley Kubie, Software Engineer.",
};

export default function ResumePage() {
  return (
    <div className="space-y-8">
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Resume
          </p>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            A print-ready copy of my resume. Use the button to save it as a PDF —
            it prints cleanly without the site navigation.
          </p>
        </div>
        <DownloadResumeButton />
      </div>

      <article className="resume-sheet mx-auto w-full max-w-[8.5in] rounded-2xl bg-white p-8 text-slate-900 shadow-2xl shadow-sky-950/30 sm:p-10">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {profile.name}
          </h1>
          <p className="mt-1 text-lg font-medium text-sky-700">{profile.title}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
            <span>{profile.location}</span>
            <a href={`mailto:${profile.email}`} className="hover:text-sky-700">
              {profile.email}
            </a>
            <a
              href={`tel:${profile.phone.replace(/-/g, "")}`}
              className="hover:text-sky-700"
            >
              {profile.phone}
            </a>
          </div>
        </header>

        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Summary
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {profile.summary}
          </p>
        </section>

        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Experience
          </h2>
          <div className="mt-3 space-y-4">
            {experienceEntries.map((entry) => (
              <div key={`${entry.company}-${entry.period}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {entry.role} — {entry.company}
                  </h3>
                  <span className="text-sm text-slate-500">{entry.period}</span>
                </div>
                <p className="text-sm italic text-slate-500">{entry.location}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {entry.summary}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {entry.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="text-sm leading-6 text-slate-700"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Education
          </h2>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {education.degree}
              </h3>
              <p className="text-sm text-slate-600">
                {education.school} · {education.location}
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {education.period} · GPA {education.gpa}
            </span>
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Skills
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {skillGroups.flatMap((group) => group.skills).join(" · ")}
          </p>
        </section>
      </article>
    </div>
  );
}
