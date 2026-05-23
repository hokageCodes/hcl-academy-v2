"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-xl border border-neutral-gray bg-white px-4 py-3.5 font-body text-neutral-text placeholder:text-neutral-text/40 transition-colors focus:border-[#21083F] focus:outline-none focus:ring-2 focus:ring-[#21083F]/15 disabled:opacity-60";

function LoginPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full opacity-100"
      preserveAspectRatio="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="admin-login-dots"
          x="0"
          y="0"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#7FF41A" fillOpacity="0.14" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#admin-login-dots)" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "same-origin",
      });
      const data = await response.json();

      if (data.success && data.authenticated) {
        router.push("/admin/dashboard");
        return;
      }
    } catch {
      // show login form
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
        return;
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto size-10 animate-spin text-[#21083F]" />
          <p className="mt-4 font-body text-sm text-neutral-text/60">
            Checking session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-[#21083F] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <LoginPattern />
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-white/80 transition-colors hover:text-accent-light"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>

        <div className="relative z-10">
          <Image
            src="/hcl-logo.png"
            alt="HCL Academy"
            width={72}
            height={72}
            className="mb-8 rounded-2xl h-auto w-[72px]"
          />
          <h1 className="font-heading text-4xl font-bold leading-tight text-white xl:text-5xl">
            HCL Academy
            <span className="mt-2 block text-accent-light">Admin</span>
          </h1>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-white/75">
            Manage payments, students, and programs from one secure dashboard.
          </p>
        </div>

        <p className="relative z-10 font-body text-sm text-white/50">
          Authorized personnel only.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mb-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#21083F] transition-colors hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-4 lg:hidden">
            <Image
              src="/hcl-logo.png"
              alt="HCL Academy"
              width={52}
              height={52}
              className="rounded-xl h-auto w-[52px]"
            />
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-wide text-[#21083F]">
                Admin
              </p>
              <h2 className="font-heading text-xl font-bold text-neutral-text">
                Sign in
              </h2>
            </div>
          </div>

          <div className="hidden lg:block">
            <p className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-[#21083F]">
              Welcome back
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-text">
              Sign in to dashboard
            </h2>
            <p className="mt-2 font-body text-neutral-text/70">
              Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              role="alert"
            >
              <p className="text-center font-body text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={cn("space-y-5", error ? "mt-6" : "mt-8 lg:mt-10")}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClassName}
                placeholder="you@hokagecreativelabs.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-heading text-sm font-semibold text-neutral-text"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={inputClassName}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-[#21083F] font-heading text-base font-semibold text-white hover:bg-accent-light hover:text-[#21083F]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 border-t border-neutral-gray pt-8">
            <Lock className="size-4 text-neutral-text/40" />
            <p className="font-body text-sm text-neutral-text/55">
              Protected area. Authorized access only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
