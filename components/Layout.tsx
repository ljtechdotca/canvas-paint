import { Canvas, Meta, Tools, TopBar } from "@components";
import { INIT_BRUSH } from "@lib/constants";
import { BrushContext } from "@lib/context";
import { IBrush } from "@types";
import { useEffect, useRef, useState } from "react";
export interface LayoutProps {}

const showCursorPreview = (
  cursor: HTMLDivElement,
  x: number,
  y: number,
  shape: string,
  size: number
) => {
  cursor.style.left = `${x - size / 2}px`;
  cursor.style.top = `${y - size / 2}px`;
  cursor.style.width = `${size}px`;
  cursor.style.height = `${size}px`;
  cursor.style.borderRadius = shape === "round" ? "100%" : "0px";
};

const toggleCursorVisibility = (cursor: HTMLDivElement, show: boolean) => {
  cursor.style.display = show === true ? "block" : "none";
};

export const Layout = ({}: LayoutProps) => {
  const [brush, setBrush] = useState<IBrush>(INIT_BRUSH);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const workAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const workArea = workAreaRef.current;
    const cursor = cursorRef.current;
    if (workArea && cursor) {
      workArea.addEventListener("mousemove", (e) => {
        showCursorPreview(cursor, e.pageX, e.pageY, brush.type, brush.width);
      });
      workArea.addEventListener("mouseenter", () => {
        toggleCursorVisibility(cursor, true);
      });
      workArea.addEventListener("mouseleave", () => {
        toggleCursorVisibility(cursor, false);
      });
      return () => {
        workArea.removeEventListener("mousemove", (e) => {
          showCursorPreview(cursor, e.pageX, e.pageY, brush.type, brush.width);
        });
        workArea.removeEventListener("mouseenter", () => {
          toggleCursorVisibility(cursor, true);
        });
        workArea.removeEventListener("mouseleave", () => {
          toggleCursorVisibility(cursor, false);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrushContext.Provider value={{ brush, setBrush }}>
      <Meta title="Canvas Paint" description="Draw " />
      <TopBar />
      <div id="work-area" ref={workAreaRef}>
        <Canvas />
        <div
          ref={cursorRef}
          id="Draw on an HTML Canvas and save your image as a .png file!"
        />
      </div>
      <Tools />
    </BrushContext.Provider>
  );
};
