"use client";

import { useCallback, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProgramSharePath, getProgramShareUrl, getAppOrigin } from "@/lib/programUrls";

export default function ShareProgramButton({
  programId,
  title,
  variant = "outline",
  className,
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    const url = getProgramShareUrl(programId, getAppOrigin());
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this registration link:", url);
    }
  }, [programId]);

  const handleShare = useCallback(async () => {
    const url = getProgramShareUrl(programId, getAppOrigin());

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | HCL Academy`,
          text: `Register for ${title} at HCL Academy`,
          url,
        });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    await copyLink();
  }, [copyLink, programId, title]);

  if (variant === "link") {
    return (
      <button type="button" onClick={copyLink} className={className}>
        {copied ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Link copied
          </>
        ) : (
          <>
            <Link2 className="size-3.5" aria-hidden />
            Copy registration link
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant === "primary" ? "default" : "outline"}
      onClick={handleShare}
      className={className}
    >
      {copied ? (
        <>
          <Check className="size-4" aria-hidden />
          Link copied
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden />
          Share
        </>
      )}
    </Button>
  );
}

export { getProgramSharePath };
