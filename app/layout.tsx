import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bradley Kubie | Software Engineer",
    template: "%s | Bradley Kubie",
  },
  description:
    "Portfolio website for Bradley Kubie, a software engineer specializing in cross-border commerce, shipping integrations, and partner applications.",
};

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
              <div>
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-white transition hover:text-sky-200"
                >
                  Bradley Kubie
                </Link>
                <p className="mt-1 text-sm text-slate-400">
                  Software engineer focused on commerce and shipping platforms
                </p>
              </div>
              <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate-300">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-sky-300/40 hover:text-sky-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-12 md:py-16">
            <div className="w-full">{children}</div>
          </main>
          <footer className="border-t border-white/10 px-6 py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>Bradley Kubie · Software Engineer · St. George, Utah</p>
              <a
                className="transition hover:text-sky-200"
                href="mailto:bradleykubie6@gmail.com"
              >
                bradleykubie6@gmail.com
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
