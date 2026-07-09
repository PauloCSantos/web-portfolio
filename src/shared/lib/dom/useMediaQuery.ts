import { useEffect, useState } from "react";

type MediaQueryMatch = boolean | null;

function getMediaQueryMatch(query: string): MediaQueryMatch {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): MediaQueryMatch {
  const [matches, setMatches] = useState<MediaQueryMatch>(() =>
    getMediaQueryMatch(query),
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(query);
    const handleChange = () => {
      setMatches(media.matches);
    };

    handleChange();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, [query]);

  return matches;
}
