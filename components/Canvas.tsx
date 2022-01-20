import { INIT_BRUSH } from "@lib/constants";
import { IBrush } from "@types";
import React, { useEffect, useRef, useState } from "react";
export interface CanvasProps {}

var zoomScale: number = 1;
var isDrawing: boolean = false;
var lastX: number | null;
var lastY: number | null;
var paths: Array<Array<any>> = [];

const getDrawConfig: any = (e: MouseEvent, brush: IBrush) => {
  return {
    x: e.offsetX,
    y: e.offsetY,
    width: brush.width,
    height: brush.height,
    shape: brush.type,
    color: e.buttons == 1 ? brush.color.primary : brush.color.secondary,
    color1: brush.color.primary,
    color2: brush.color.secondary,
    alpha: brush.opacity / 100,
    operation: brush.operation,
    effect: brush.effect,
  };
};

const draw = (
  ctx: CanvasRenderingContext2D,
  cfg: any,
  canvas: HTMLCanvasElement
) => {
  makePath(ctx, cfg);
  switch (cfg.effect) {
    case "mirror-x":
      return mirrorX(ctx, cfg, canvas);
      break;
    case "mirror-y":
      return mirrorY(ctx, cfg, canvas);
      break;
    case "":
      return;
      break;
  }
};

const makePath = (ctx: CanvasRenderingContext2D, cfg: any) => {
  ctx.globalCompositeOperation = cfg.operation;
  ctx.globalAlpha = cfg.alpha;
  ctx.fillStyle = cfg.color;
  ctx.strokeStyle = cfg.color;
  ctx.lineWidth = cfg.width;
  ctx.lineCap = cfg.shape === "round" ? "round" : "square";
  ctx.lineJoin = cfg.shape === "round" ? "round" : "bevel";
  ctx.imageSmoothingQuality = "high";
  ctx.scale(zoomScale, zoomScale);
  ctx.beginPath();

  if (lastX && lastY && (cfg.x !== lastX || cfg.y !== lastY)) {
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(cfg.x, cfg.y);
    ctx.stroke();
  } else {
    if (cfg.shape === "square") {
      ctx.rect(
        cfg.x - cfg.width / 2,
        cfg.y - cfg.width / 2,
        cfg.width,
        cfg.height
      );
    } else {
      ctx.arc(cfg.x, cfg.y, cfg.width / 2, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.closePath();
  lastX = cfg.x;
  lastY = cfg.y;
  paths[paths.length - 1].push(cfg);
};

const mirrorX = (
  ctx: CanvasRenderingContext2D,
  cfg: any,
  canvas: HTMLCanvasElement
) => {
  let mirror_x: number = cfg.x;
  if (cfg.x < canvas.width / 2) {
    mirror_x = canvas.width - cfg.x;
  } else if (cfg.x > canvas.width / 2) {
    mirror_x = canvas.width / 2 - (cfg.x - canvas.width / 2);
  }
  let mirror_cfg = Object.assign({}, cfg, { x: mirror_x, effect: "" });
  lastX = null;
  lastY = null;
  makePath(ctx, mirror_cfg);
  lastX = null;
  lastY = null;
};

const mirrorY = (
  ctx: CanvasRenderingContext2D,
  cfg: any,
  canvas: HTMLCanvasElement
) => {
  let mirror_y: number = cfg.y;
  if (cfg.y < canvas.height / 2) {
    mirror_y = canvas.height - cfg.y;
  } else if (cfg.y > canvas.height / 2) {
    mirror_y = canvas.height / 2 - (cfg.y - canvas.height / 2);
  }
  let mirror_cfg = Object.assign({}, cfg, { y: mirror_y, effect: "" });
  lastX = null;
  lastY = null;
  makePath(ctx, mirror_cfg);
  lastX = null;
  lastY = null;
};

const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.clearRect(0, 0, canvas.offsetWidth || 0, canvas.offsetHeight || 0);
  paths = [];
};

const undoPath = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  let new_paths = paths.slice(0, -1);
  clearCanvas(ctx, canvas);
  if (new_paths.length > 0) {
    paths[0] = [];
    new_paths.forEach((new_path, i) => {
      new_path.forEach((cfg) => makePath(ctx, cfg));
      lastX = null;
      lastY = null;
      if (i < new_paths.length - 1) {
        paths.push([]);
      }
    });
  }
};

const saveImageWithName = (canvas: HTMLCanvasElement) => {
  let file_name = prompt("File Name");
  if (file_name) {
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = file_name;
    link.click();
    link.remove();
  }
};

export const Canvas = ({}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brush, setBrush] = useState<IBrush>(INIT_BRUSH);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      setContext(ctx);
      canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        paths.push([]);
        draw(ctx, getDrawConfig(e, brush), canvas);
      });
      canvas.addEventListener("mousemove", (e) => {
        if (isDrawing === true) {
          draw(ctx, getDrawConfig(e, brush), canvas);
        }
      });
      canvas.addEventListener("mouseup", () => {
        (isDrawing = false), (lastX = null);
        lastY = null;
      });
      canvas.addEventListener("mouseleave", () => {
        (isDrawing = false), (lastX = null);
        lastY = null;
      });
      canvas.addEventListener("contextmenu", (e) => e.preventDefault());
      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key == "z") {
          undoPath(ctx, canvas);
        }
      });
      window.addEventListener("clear-canvas", () => clearCanvas(ctx, canvas));
      window.addEventListener("save-as", () => saveImageWithName(canvas));

      return () => {
        canvas.removeEventListener("mousedown", (e) => {
          isDrawing = true;
          paths.push([]);
          draw(ctx, getDrawConfig(e, brush), canvas);
        });
        canvas.removeEventListener("mousemove", (e) => {
          if (isDrawing === true) {
            draw(ctx, getDrawConfig(e, brush), canvas);
          }
        });
        canvas.removeEventListener("mouseup", () => {
          (isDrawing = false), (lastX = null);
          lastY = null;
        });
        canvas.removeEventListener("mouseleave", () => {
          (isDrawing = false), (lastX = null);
          lastY = null;
        });
        canvas.removeEventListener("contextmenu", (e) => e.preventDefault());
        window.removeEventListener("keydown", (e) => {
          if (e.ctrlKey && e.key == "z") {
            undoPath(ctx, canvas);
          }
        });
        window.removeEventListener("clear-canvas", () =>
          clearCanvas(ctx, canvas)
        );
        window.removeEventListener("save-as", () => saveImageWithName(canvas));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas className="canvas-layer" ref={canvasRef} height="600" width="800" />
  );
};
