import React, { useEffect, useRef, useState } from "react";

/** True when the user prefers reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** Observe an element; returns [ref, isVisible] once it enters the viewport. */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

/**
 * Scroll-reveal wrapper. Children fade/slide in when entering the viewport.
 * variant: "" (up) | "left" | "right" | "zoom" | "mask"
 * delay: stagger delay in ms.
 */
export function Reveal({
  as: Tag = "div",
  variant = "",
  delay = 0,
  className = "",
  style = {},
  children,
  ...rest
}) {
  const [ref, inView] = useInView();
  const base = variant === "mask" ? "mask-reveal" : "reveal";
  const variantClass = ["left", "right", "zoom"].includes(variant)
    ? ` reveal-${variant}`
    : "";
  return (
    <Tag
      ref={ref}
      className={`${base}${variantClass}${inView ? " is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Smooth-scroll to a section id, accounting for the sticky navbar. */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * 3D tilt + cursor spotlight for cards.
 * Returns props to spread on the card element; CSS class "spotlight-card"
 * renders the light via --mx/--my custom properties.
 */
export function useTilt({ max = 8, scale = 1.015 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip touch devices
    let raf = 0;

    const onMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        const rx = (0.5 - py) * max * 2;
        const ry = (px - 0.5) * max * 2;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      });
    };

    const onLeave = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      el.style.transform = "";
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced, max, scale]);

  return { ref };
}
