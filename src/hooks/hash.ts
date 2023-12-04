import { useEffect, useState } from "react";

export function useHash() {
  const [hash, setHash] = useState(location.hash.slice(1));
  useEffect(() => {
    const change = () => {
      setHash(location.hash.slice(1));
    };
    window.addEventListener("hashchange", change);

    return () => {
      window.removeEventListener("hashchange", change);
    };
  }, []);
  useEffect(() => {
    location.hash = hash;
  }, [hash]);
  return [hash, setHash] as const;
}
