import { useEffect } from "react";

type Seo = { title: string; description: string; path: string; image?: string };

const ORIGIN = "https://profildoors-roomer.ru";

const setMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const prev = el.content;
  el.content = value;
  return () => {
    el!.content = prev;
  };
};

const useSeo = ({ title, description, path, image }: Seo) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const url = ORIGIN + path;
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevCanonical = canonical?.href;
    if (canonical) canonical.href = url;
    const restore = [
      setMeta("name", "description", description),
      setMeta("property", "og:title", title),
      setMeta("property", "og:description", description),
      setMeta("property", "og:url", url),
      setMeta("name", "twitter:title", title),
      setMeta("name", "twitter:description", description),
      ...(image ? [setMeta("property", "og:image", ORIGIN + image), setMeta("name", "twitter:image", ORIGIN + image)] : []),
    ];
    return () => {
      document.title = prevTitle;
      if (canonical && prevCanonical) canonical.href = prevCanonical;
      restore.forEach((r) => r());
    };
  }, [title, description, path, image]);
};

export default useSeo;
