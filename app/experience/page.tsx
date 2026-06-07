import type { Metadata } from "next";
import { education, experienceEntries } from "../portfolio-content";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and education for Bradley Kubie.",
};

export default function ExperiencePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Experience
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Product, platform, and integration work across commerce systems.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-300">
          Highlights from roles spanning cross-border e-commerce, white-label
          partner launches, and high-availability software delivery.
        </p>
      </section>

      <section className="space-y-6">
        {experienceEntries.map((entry) => (
          <article
            key={entry.company}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8"
          >
            <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                  {entry.period}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">
                  {entry.role}
                </h2>
                <p className="mt-2 text-lg text-slate-300">
                  {entry.company} · {entry.location}
                </p>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                {entry.summary}
              </p>
            </div>
            <ul className="mt-6 grid gap-4">
              {entry.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-base leading-7 text-slate-300"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Education
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-white">{education.degree}</h2>
        <p className="mt-2 text-lg text-slate-300">
          {education.school} · {education.location}
        </p>
        <p className="mt-4 text-base leading-7 text-slate-300">
          {education.period} · GPA {education.gpa}
        </p>
      </section>
    </div>
  );
}
