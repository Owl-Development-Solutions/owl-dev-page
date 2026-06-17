import Image from "next/image";
import type { ReactNode } from "react";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_70%_10%,rgba(34,211,238,0.16),transparent_55%),radial-gradient(750px_circle_at_20%_30%,rgba(99,102,241,0.10),transparent_60%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#07090d]/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="group inline-flex items-center gap-3">
            <span className="logo-glow-wrap relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <Image
                src="/owldev.png"
                alt="OWLDEV logo"
                width={36}
                height={36}
                className="logo-image h-9 w-9 rounded-full object-cover"
                priority
              />
              <span className="logo-glow-ring absolute inset-0 rounded-full" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-wide">
                OWLDEV
              </span>
              <span className="block text-[11px] text-zinc-400">
                Tech Solutions
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">
            <a className="hover:text-white" href="#home">
              Home
            </a>
            <a className="hover:text-white" href="#services">
              Services
            </a>
            <a className="hover:text-white" href="#portfolio">
              Portfolio
            </a>
            <a className="hover:text-white" href="#about">
              About
            </a>
          </nav>

          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-300/25 transition hover:bg-cyan-400/15"
          >
            Get a Quote
          </a>
        </div>
      </header>

      <main id="home" className="relative">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-16 md:pb-16 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
                Web • Design • Apps • Software • Ads
              </p>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Empowering Your{" "}
                <span className="text-cyan-200">Digital Vision</span>
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-zinc-300 md:text-lg">
                Expert solutions in web development, UI/UX design, apps, custom
                software, and Meta ads—crafted to look premium and convert.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#services"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-semibold text-[#061018] shadow-[0_10px_30px_-15px_rgba(34,211,238,0.7)] transition hover:bg-cyan-200"
                >
                  Explore Our Services
                </a>
                <a
                  href="#portfolio"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white/5 px-6 text-sm font-semibold text-zinc-100 ring-1 ring-white/10 transition hover:bg-white/7"
                >
                  View Portfolio
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Projects" value="50+" />
                <Stat label="Clients" value="30+" />
                <Stat label="Years" value="5+" />
                <Stat label="Support" value="24/7" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 rounded-3xl bg-[radial-gradient(closest-side,rgba(34,211,238,0.25),transparent)] blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_30px_120px_-80px_rgba(34,211,238,0.65)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
                  </div>
                  <span className="text-xs text-zinc-400">owldev.app</span>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300/10 ring-1 ring-cyan-300/20">
                        <IconCode />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Clean, modern UI</p>
                        <p className="text-xs text-zinc-400">
                          Built for speed and clarity.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-300/10 ring-1 ring-indigo-300/20">
                        <IconSpark />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">
                          Premium glow aesthetic
                        </p>
                        <p className="text-xs text-zinc-400">
                          Subtle gradients & depth.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 ring-1 ring-emerald-300/20">
                        <IconBolt />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Conversion-first</p>
                        <p className="text-xs text-zinc-400">
                          Calls-to-action that work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(99,102,241,0.08),rgba(0,0,0,0))] p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold">Ready to launch?</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Let’s build something you’re proud to share.
                      </p>
                    </div>
                    <a
                      href="#contact"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-white/5 px-4 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/7"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16"
        >
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-zinc-400">
                SERVICES
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                What we do best
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                Everything you need to go from idea to a professional digital
                product—designed clean, built fast, and optimized to grow.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <ServiceCard
              title="Web Dev"
              subtitle="Modern websites"
              icon={<IconCode />}
            />
            <ServiceCard
              title="Web Design"
              subtitle="UI/UX & branding"
              icon={<IconLayout />}
            />
            <ServiceCard
              title="App Dev"
              subtitle="iOS & Android"
              icon={<IconPhone />}
            />
            <ServiceCard
              title="Software Dev"
              subtitle="Custom systems"
              icon={<IconCpu />}
            />
            <ServiceCard
              title="Meta Ads"
              subtitle="Growth campaigns"
              icon={<IconMegaphone />}
            />
          </div>
        </section>

        {/* Portfolio */}
        <section
          id="portfolio"
          className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-zinc-400">
                PORTFOLIO
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Recent work
              </h2>
            </div>
            <a
              href="#contact"
              className="hidden rounded-full bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/7 md:inline-flex"
            >
              Request a demo
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PortfolioCard
              title="Mobile Banking UI"
              tags={["UI/UX", "Design System"]}
            />
            <PortfolioCard
              title="SaaS Dashboard"
              tags={["Web App", "Analytics"]}
            />
            <PortfolioCard title="Company Website" tags={["Brand", "Landing"]} />
          </div>
        </section>

        {/* About + Contact */}
        <section
          id="about"
          className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 md:pb-28 md:pt-16"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <p className="text-xs font-semibold tracking-wider text-zinc-400">
                WHY OWLDEV
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Professional builds, without the fluff
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                We blend clean design with reliable engineering so your product
                looks premium and feels effortless. You get clear communication,
                fast iterations, and a site that performs.
              </p>

              <div className="mt-6 grid gap-3">
                <Bullet
                  title="Modern stack"
                  text="Fast, responsive, and SEO-ready."
                />
                <Bullet
                  title="Pixel-perfect UI"
                  text="Careful spacing, typography, and polish."
                />
                <Bullet
                  title="Launch support"
                  text="We stay with you through release."
                />
              </div>
            </div>

            <div
              id="contact"
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <p className="text-xs font-semibold tracking-wider text-zinc-400">
                CONTACT US
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Tell us about your project
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Share a quick summary and we’ll respond with next steps.
              </p>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#07090d]/60">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-10 md:grid-cols-3 md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
              <OwlMark />
            </span>
            <div>
              <p className="text-sm font-semibold">OWLDEV Tech Solutions</p>
              <p className="text-xs text-zinc-400">
                Websites • Apps • Software • Ads
              </p>
            </div>
          </div>
          <div className="text-sm text-zinc-400 md:text-center">
            © {new Date().getFullYear()} OWLDEV. All rights reserved.
          </div>
          <div className="flex gap-3 md:justify-end">
            <a
              href="#"
              className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/7"
            >
              Facebook
            </a>
            <a
              href="#contact"
              className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/7"
            >
              Email us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:bg-cyan-300/15" />
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/7">
      <div className="aspect-[16/10] rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(99,102,241,0.10),rgba(255,255,255,0.04))] ring-1 ring-white/10">
        <div className="flex h-full items-end justify-between p-4">
          <div className="rounded-xl bg-black/35 px-3 py-2 ring-1 ring-white/10">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-zinc-400">
              {tags.slice(0, 2).join(" • ")}
            </p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 transition group-hover:bg-white/7">
            <IconArrowUpRight />
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Bullet({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
      <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-lg bg-cyan-300/10 ring-1 ring-cyan-300/20">
        <IconCheck />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-6 text-zinc-400">{text}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{label}</p>
    </div>
  );
}

function OwlMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 7c1.5 0 2.8 1 3.2 2.4A6.7 6.7 0 0 1 12 9c1 0 2 .2 2.8.4C15.2 8 16.5 7 18 7c2 0 3.7 1.6 3.7 3.7 0 2.5-1.2 4.9-3.1 6.5A10.6 10.6 0 0 1 12 20a10.6 10.6 0 0 1-6.6-2.8C3.5 15.6 2.3 13.2 2.3 10.7 2.3 8.6 4 7 6 7Z"
        stroke="rgba(34,211,238,0.95)"
        strokeWidth="1.3"
      />
      <path
        d="M9.2 12.2a1.6 1.6 0 1 0 0-.1Z"
        stroke="rgba(34,211,238,0.95)"
        strokeWidth="1.2"
      />
      <path
        d="M14.8 12.2a1.6 1.6 0 1 0 0-.1Z"
        stroke="rgba(34,211,238,0.95)"
        strokeWidth="1.2"
      />
      <path
        d="M12 13.7c.9 0 1.7.5 2.1 1.2-.6.5-1.3.8-2.1.8-.8 0-1.5-.3-2.1-.8.4-.7 1.2-1.2 2.1-1.2Z"
        stroke="rgba(34,211,238,0.95)"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18 3 12l6-6M15 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLayout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h16v14H4V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 9h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 5v14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M11 17h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 9h6v6H9V9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M4 12h2m12 0h2M12 4v2m0 12v2M7 7l-1-1m12 12-1-1m0-10 1-1M6 18l1-1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 6h12v12H6V6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.7"
      />
    </svg>
  );
}

function IconMegaphone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12v-2c0-1.1.9-2 2-2h1l9-3v14l-9-3H6c-1.1 0-2-.9-2-2v-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 16l1.2 4.2a2 2 0 0 0 1.9 1.4h.3a2 2 0 0 0 1.9-2.6L12 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.2 5.2L18 9l-4.8 1.8L12 16l-1.2-5.2L6 9l4.8-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 14l.7 2.7L22 18l-2.3.8L19 21l-.7-2.2L16 18l2.3-1.3L19 14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M13 2 4 14h7l-1 8 10-12h-7l0-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m20 6-11 11-5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17 17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
