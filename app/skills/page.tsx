import type { Metadata } from "next";
import { skillGroups } from "../portfolio-content";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills and domain expertise for Bradley Kubie.",
};

export default function SkillsPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          Skills
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Technologies, platforms, and domain depth behind the work.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-300">
          A working toolkit for building integrations, partner apps, and
          commerce features that connect storefronts, carriers, and backend
          systems.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {skillGroups.map((group) => (
          <article
            key={group.title}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-2xl font-semibold text-white">{group.title}</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
