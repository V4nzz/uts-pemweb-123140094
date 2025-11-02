import { useEffect, useRef } from "react";

export default function LoadMoreSentinel({ disabled, onLoadMore }) {
  const ref = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    }, { rootMargin: "200px" });

    io.observe(el);
    return () => io.disconnect();
  }, [disabled, onLoadMore]);

  return <div ref={ref} className="sentinel" aria-hidden="true" />;
}
