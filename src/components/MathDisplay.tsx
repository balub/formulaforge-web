import React, { useEffect, useRef } from "react";
import katex from "katex";

interface MathDisplayProps {
  math: string;
  display?: boolean;
  className?: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({
  math,
  display = true,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
          strict: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (ref.current) {
          ref.current.textContent = math;
        }
      }
    }
  }, [math, display]);

  return <div ref={ref} className={className} />;
};

export default MathDisplay;
