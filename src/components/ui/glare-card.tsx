
"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

export interface GlareCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlareCard = ({ children, className }: GlareCardProps) => {
  const isPointerInside = useRef(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    isPointerInside.current = true;
  };

  const handleMouseLeave = () => {
    isPointerInside.current = false;
  };

  return (
    <div
      ref={divRef}
      className={cn(
        "relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-8",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(255,255,255,.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};
