"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";

const ROUTE_KEY = "route";
const FALLBACK_TIMEOUT_MS = 6000;

// Watches for clicks on internal links so the branded loader can play
// during page-to-page navigation, then clears itself once the new route's
// pathname lands. No changes needed to existing <Link>/<Button> usages.
export function RouteLoader() {
  const pathname = usePathname();
  const { show, hide } = useLoader();
  const isFirstRender = useRef(true);
  const isNavigating = useRef(false);
  const fallbackTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isNavigating.current) {
      isNavigating.current = false;
      if (fallbackTimer.current !== null) {
        window.clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
      }
      hide(ROUTE_KEY);
    }
  }, [pathname, hide]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      isNavigating.current = true;
      show(ROUTE_KEY);

      if (fallbackTimer.current !== null) window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(() => {
        isNavigating.current = false;
        hide(ROUTE_KEY);
      }, FALLBACK_TIMEOUT_MS);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [show, hide]);

  return null;
}
