import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      className="bg-white px-6 pb-24 pt-8 md:pt-12"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-[#21083F] px-8 py-14 shadow-none md:px-14 md:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="mb-4 inline-flex rounded-full border border-white/20 px-4 py-1.5 font-heading text-sm font-semibold tracking-wide text-white">
              Take the next step
            </p>
            <h2
              id="cta-heading"
              className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-tight"
            >
              Ready to start your journey?
            </h2>
            <p className="mt-5 font-body text-lg leading-relaxed text-white/80 md:text-xl">
              Join a vibrant community, learn practical skills, and unlock new
              opportunities in tech. Your first step is one click away.
            </p>

            <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:justify-center">
              <Button
                asChild
                size="xl"
                className="h-12 w-full rounded-xl bg-accent-light font-heading font-semibold text-primary shadow-none hover:bg-white hover:text-primary sm:w-auto sm:min-w-[200px]"
              >
                <Link href="/programs" className="inline-flex items-center gap-2">
                  Get Started
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="h-12 w-full rounded-xl border-white/30 bg-transparent font-heading font-semibold text-white shadow-none hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[200px]"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
