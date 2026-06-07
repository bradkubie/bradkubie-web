import Link from "next/link";
import { featuredHighlights, profile, skillGroups } from "./portfolio-content";

const featureCards = [
  {
    href: "/about",
    title: "About",
    description:
      "Learn how Bradley approaches product delivery, cross-functional collaboration, and reliable software design.",
  },
  {
    href: "/experience",
    title: "Experience",
    description:
      "See the platform work, white-label launches, and e-commerce integrations behind the resume.",
  },
  {
    href: "/skills",
    title: "Skills",
    description:
      "Browse the tools, platforms, and domain expertise that support cross-border shipping products.",
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/20 backdrop-blur md:grid-cols-[1.7fr_1fr] md:p-12">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            {profile.title}
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {profile.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              {profile.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2">
              {profile.location}
            </span>
            <a
              className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
              href={`mailto:${profile.email}`}
            >
              {profile.email}
            </a>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              className="rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              href="/experience"
            >
              View experience
            </Link>
            <Link
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200"
              href="/skills"
            >
              Explore skills
            </Link>
          </div>
        </div>
        <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
            Snapshot
          </p>
          {featuredHighlights.map((highlight) => (
            <div
              key={highlight.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <p className="text-3xl font-semibold text-white">{highlight.value}</p>
              <p className="mt-1 text-sm text-slate-300">{highlight.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Focus areas
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Building shipping and commerce software that holds up in production.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition hover:border-sky-300/40 hover:bg-white/[0.08]"
            >
              <h3 className="text-xl font-semibold text-white transition group-hover:text-sky-200">
                {card.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-300">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Core strengths
          </p>
          <div className="mt-6 grid gap-4">
            {profile.strengths.map((strength) => (
              <div
                key={strength.title}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{strength.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Skill categories
          </p>
          <div className="mt-6 space-y-5">
            {skillGroups.slice(0, 3).map((group) => (
              <div key={group.title}>
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {group.skills.join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
