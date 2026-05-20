import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    if (!id) return;

    // Use requestAnimationFrame to ensure DOM is fully rendered before querying
    const raf = requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // If element not found, silently no-op (no error thrown)
    });

    return () => cancelAnimationFrame(raf);
  }, [hash]);
}
