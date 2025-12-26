// Calendly widget loader for Next.js
"use client";
import { useEffect } from "react";

export default function CalendlyWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  return null;
}
