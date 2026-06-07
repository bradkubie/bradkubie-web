import type { Metadata } from "next";
import Image from "next/image";
import { aboutSections, profile } from "../portfolio-content";

export const metadata: Metadata = {
  title: "About",
  description: "Background, focus, and working style for Bradley Kubie.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
          About
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Software engineer focused on cross-border commerce and shipping systems.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-300">
          {profile.summary}
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Based in
          </p>
          <p className="mt-3 text-xl font-semibold text-white">{profile.location}</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Experience
          </p>
          <p className="mt-3 text-xl font-semibold text-white">7+ years</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Contact
          </p>
          <a
            className="mt-3 inline-block text-xl font-semibold text-sky-200 transition hover:text-sky-100"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </a>
        </div>
      </section>

      <section className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-950/20 backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Personally
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Family, the outdoors, and staying active matter a lot to me.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            {profile.personalSummary}
          </p>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/50">
          <Image
            src="/my-family.jpg"
            alt="Bradley Kubie with his family"
            width={5856}
            height={3904}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {aboutSections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-6"
          >
            <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {section.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
