"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Small reusable theme toggle.
 * We will use this later in account settings
 * and optionally in the header.
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting until client mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground"
      >
        Theme
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}