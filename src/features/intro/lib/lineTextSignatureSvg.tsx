import type { CSSProperties, SVGProps } from "react";

type BuildLineTextSignatureSvgParams = {
  text: string;
  rows: number;
  rowHeight: number;
  usableHeight: number;
  width: number;
  height: number;
  radius: number;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  maskId: string;
  animated?: boolean;
};

type LineRectProps = SVGProps<SVGRectElement> & {
  "data-line-text-signature-line"?: string;
};

export function getLineTextWrapperStyle(width: number, height: number): CSSProperties {
  return {
    width: "100%",
    maxWidth: width,
    aspectRatio: `720 / 160`,
    maxHeight: height,
  };
}

export function buildLineTextSignatureSvg({
  text,
  rows,
  rowHeight,
  usableHeight,
  width,
  height,
  radius,
  fontFamily,
  fontWeight,
  fontSize,
  maskId,
  animated,
}: BuildLineTextSignatureSvgParams) {
  const lines = Array.from({ length: rows }, (_, index) => {
    const y = index * rowHeight + (rowHeight - usableHeight) / 2;
    const rectProps: LineRectProps = {
      x: 0,
      y,
      width,
      height: usableHeight,
      rx: radius,
      fill: "currentColor",
      opacity: 0.95,
    };

    if (animated) {
      rectProps.opacity = 0;
      rectProps.filter = "blur(3px)";
      rectProps.transform = `translate(${index % 2 === 0 ? -width : width} 0)`;
      rectProps["data-line-text-signature-line"] = "";
    }

    return <rect key={index} {...rectProps} />;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={width} height={height} fill="black" />
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fontSize={fontSize}
            letterSpacing="-0.5"
          >
            {text}
          </text>
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>{lines}</g>
    </svg>
  );
}
