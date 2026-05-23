"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROGRAM_OPTIONS = [
  { value: "", label: "Select a program..." },
  { value: "intro-to-web-development", label: "Intro to Web Development" },
  { value: "ui-ux-design-fundamentals", label: "UI/UX Design Fundamentals" },
  { value: "vibe-coding-essentials", label: "Vibe Coding Essentials" },
  { value: "general", label: "General inquiry" },
];

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "Email us",
    description: "For admissions and general questions",
    href: "mailto:hokage@hokagecreativelabs.com",
    value: "hokage@hokagecreativelabs.com",
  },
  {
    icon: Phone,
    title: "Call us",
    description: "Mon–Fri, 8am to 5pm WAT",
    href: "tel:+2349035104366",
    value: "+234 903 510 4366",
  },
  {
    icon: MapPin,
    title: "Visit us",
    description: "Come say hello at our HQ",
    value: "8, Folagoro road, Shomolu\nLagos, Nigeria",
  },
];

const SOCIAL_LINKS = [
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "Instagram", icon: Instagram },
];

const inputClassName =
  "w-full rounded-xl border border-neutral-gray bg-white px-4 py-3.5 font-body text-neutral-text placeholder:text-neutral-text/40 transition-colors focus:border-[#21083F] focus:outline-none focus:ring-2 focus:ring-[#21083F]/15";

function ContactInfoCard({ item, variant = "soft" }) {
  const Icon = item.icon;

  const iconStyles = {
    purple: "bg-[#21083F] text-white",
    lime: "bg-accent-light text-[#21083F]",
    soft: "bg-[#21083F]/10 text-[#21083F]",
  };

  return (
    <article className="group rounded-2xl border border-neutral-gray bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-light/60 hover:shadow-glass">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            iconStyles[variant] || iconStyles.soft
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-heading text-base font-bold text-neutral-text">
            {item.title}
          </h3>
          <p className="mt-1 font-body text-sm text-neutral-text/60">
            {item.description}
          </p>
          {item.href ? (
            <a
              href={item.href}
              className="mt-2 inline-block font-heading text-sm font-semibold text-[#21083F] underline-offset-2 transition-colors hover:underline"
            >
              {item.value}
            </a>
          ) : (
            <p className="mt-2 whitespace-pre-line font-body text-sm leading-relaxed text-neutral-text">
              {item.value}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function TalkToAdvisorButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    const tryOpen = () => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url: "https://calendly.com/hokagecreativelabs001/30mins",
        });
        setLoading(false);
      } else {
        setTimeout(tryOpen, 100);
      }
    };

    tryOpen();
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      variant="outline"
      className="h-12 w-full rounded-xl border-[#21083F]/20 font-heading font-semibold text-[#21083F] hover:border-accent-light hover:bg-accent-light/10 sm:w-auto"
    >
      <Calendar className="mr-2 size-4" />
      {loading ? "Loading…" : "Book a call"}
    </Button>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", program: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden border-b border-neutral-gray bg-white px-6 pt-44 md:min-h-[60vh] md:pt-48 lg:pt-52">
        <div
          className="pointer-events-none absolute -right-24 top-1/4 size-72 rounded-full bg-accent-light/25 blur-3xl md:size-96"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-[#21083F]/8 blur-3xl md:size-80"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-accent-light/40 bg-accent-light/15 px-4 py-1.5 font-heading text-sm font-semibold uppercase tracking-wide text-[#21083F]">
            Get in touch
          </p>
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-neutral-text md:text-6xl lg:text-7xl">
            Let&apos;s start a{" "}
            <span className="text-[#21083F]">conversation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-neutral-text/75 md:text-xl">
            Questions about our programs, admissions, or partnerships? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact + Form */}
      <section className="relative bg-white px-6 py-16 md:py-24">
        <div
          className="pointer-events-none absolute right-0 top-20 size-56 rounded-full bg-accent-light/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Left: contact info */}
          <div className="relative space-y-5 lg:col-span-2">
            <div>
              <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-[#21083F]">
                Reach us
              </p>
              <h2 className="font-heading text-2xl font-bold text-neutral-text md:text-3xl">
                We&apos;re here to{" "}
                <span className="text-[#21083F]">help</span>
              </h2>
              <p className="mt-2 font-body text-neutral-text/75">
                Prefer a quick chat? Book a call or drop us a line — we typically
                reply within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_ITEMS.map((item, index) => (
                <ContactInfoCard
                  key={item.title}
                  item={item}
                  variant={["purple", "lime", "soft"][index]}
                />
              ))}
            </div>

            <article className="rounded-2xl border border-[#21083F]/15 bg-[#21083F]/5 p-6">
              <h3 className="font-heading text-base font-bold text-[#21083F]">
                Follow our journey
              </h3>
              <p className="mt-1 font-body text-sm text-neutral-text/70">
                Stay updated on cohort launches and student wins.
              </p>
              <div className="mt-4 flex gap-3">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-xl border border-[#21083F]/15 bg-white text-[#21083F] transition-colors hover:border-accent-light hover:bg-accent-light hover:text-[#21083F]"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </article>

            <div className="flex flex-col gap-3 sm:flex-row">
              <TalkToAdvisorButton />
              <Button
                asChild
                className="h-12 w-full rounded-xl bg-[#21083F] font-heading font-semibold text-white hover:bg-accent-light hover:text-[#21083F] sm:w-auto"
              >
                <Link href="/programs" className="inline-flex items-center gap-2">
                  View Programs
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-neutral-gray bg-white shadow-card">
              <div className="h-1.5 bg-gradient-to-r from-[#21083F] via-[#21083F] to-accent-light" />
              <div className="p-6 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-neutral-text">
                Send us a message
              </h2>
              <p className="mt-2 font-body text-neutral-text/75">
                Fill out the form below and we&apos;ll get back to you soon.
              </p>

              {status === "success" ? (
                <div
                  className="mt-8 rounded-2xl border border-accent-light bg-accent-light/15 px-6 py-8 text-center"
                  role="status"
                >
                  <p className="font-heading text-lg font-bold text-[#21083F]">
                    Message sent!
                  </p>
                  <p className="mt-2 font-body text-neutral-text/75">
                    Thanks for reaching out. Check your inbox for a confirmation
                    — we&apos;ll reply within 24 hours.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setStatus("idle")}
                    variant="outline"
                    className="mt-6 rounded-xl border-[#21083F] font-heading font-semibold text-[#21083F] hover:bg-[#21083F] hover:text-white"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
                      >
                        Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="program"
                      className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
                    >
                      Program of interest
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={cn(inputClassName, "cursor-pointer appearance-none")}
                    >
                      {PROGRAM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
                    >
                      Your message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about yourself and what you're looking for..."
                      className={cn(inputClassName, "resize-none")}
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <p
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
                      role="alert"
                    >
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="h-12 w-full rounded-xl bg-[#21083F] font-heading text-base font-semibold text-white hover:bg-accent-light hover:text-[#21083F] disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      "Sending…"
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Send message
                        <Send className="size-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
