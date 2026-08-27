import { useEffect, useState } from "react";

function isCompactPortrait(): boolean {
  return window.matchMedia("(orientation: portrait)").matches && window.innerWidth < 768;
}

export function useOrientation() {
  const [compactPortrait, setCompactPortrait] = useState(isCompactPortrait);

  useEffect(() => {
    const orientation = window.matchMedia("(orientation: portrait)");
    const update = () => setCompactPortrait(isCompactPortrait());

    orientation.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      orientation.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { compactPortrait };
}
