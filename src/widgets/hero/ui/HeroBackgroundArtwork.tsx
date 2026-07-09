import type { RefObject } from "react";

const GRID_SIZE = "clamp(72px, 4.4vw, 148px) clamp(72px, 4.4vw, 148px)";

type HeroBackgroundArtworkProps = {
  rootRef?: RefObject<HTMLDivElement | null>;
  planeARef?: RefObject<HTMLDivElement | null>;
  planeBRef?: RefObject<HTMLDivElement | null>;
  scanRef?: RefObject<HTMLDivElement | null>;
  animated?: boolean;
};

export function HeroBackgroundArtwork({
  rootRef,
  planeARef,
  planeBRef,
  scanRef,
  animated = false,
}: HeroBackgroundArtworkProps) {
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-border) 64%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-border) 58%, transparent) 1px, transparent 1px)",
          backgroundSize: GRID_SIZE,
          maskImage:
            "linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.64) 38%, rgba(0,0,0,0) 78%)",
          WebkitMaskImage:
            "linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.64) 38%, rgba(0,0,0,0) 78%)",
        }}
      />

      <div
        ref={planeARef}
        className={[
          "absolute -left-[12vw] top-[14%] h-[clamp(18rem,30vw,42rem)] w-[clamp(24rem,42vw,58rem)]",
          animated ? "" : "rotate-[-8deg]",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 34%, transparent) 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 45%, transparent 72%)",
          clipPath: "polygon(0 18%, 88% 0, 100% 64%, 8% 100%)",
          filter: animated ? "blur(0.3px)" : undefined,
        }}
      />

      <div
        ref={planeBRef}
        className={[
          "absolute bottom-[8%] right-[-18vw] h-[clamp(16rem,28vw,38rem)] w-[clamp(26rem,45vw,64rem)]",
          animated ? "" : "rotate-[10deg]",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(145deg, transparent 8%, color-mix(in srgb, var(--color-primary) 18%, transparent) 38%, color-mix(in srgb, var(--color-fg) 8%, transparent) 100%)",
          clipPath: "polygon(18% 0, 100% 12%, 82% 100%, 0 74%)",
        }}
      />

      <div
        ref={scanRef}
        className={[
          "absolute inset-y-0 w-[clamp(9rem,13vw,18rem)]",
          animated ? "left-[-14rem]" : "left-[22%] opacity-20",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(to right, transparent 0%, color-mix(in srgb, var(--color-primary) 24%, transparent) 44%, color-mix(in srgb, var(--color-fg) 12%, transparent) 50%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 6%, rgba(0,0,0,0.95) 28%, rgba(0,0,0,0.95) 72%, transparent 94%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 6%, rgba(0,0,0,0.95) 28%, rgba(0,0,0,0.95) 72%, transparent 94%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 72%, transparent) 0%, transparent 42%, var(--color-bg) 100%), linear-gradient(180deg, transparent 0%, var(--color-bg) 92%)",
        }}
      />
    </div>
  );
}
