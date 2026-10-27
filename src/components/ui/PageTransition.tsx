"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Smooth scroll to top on page change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={`page-transition-wrapper flex-1 w-full ${
        mounted ? "animate-page-enter" : ""
      }`}
    >
      {children}
    </div>
  );
}
