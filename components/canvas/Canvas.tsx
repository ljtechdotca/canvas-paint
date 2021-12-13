import { INIT_BRUSH } from "@lib/constants";
import { DataContext } from "@lib/context";
import { IBrush } from "@types";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Canvas.module.scss";
export interface CanvasProps {}

var isDrawing : boolean = false;
var lastX : number | null;
var lastY : number | null;
var paths : Array<any> = [];

const getDrawConfig : any = (e: MouseEvent, brush: IBrush) => {
  return {
    x: e.offsetX,
    y: e.offsetY,
    width: brush.width,
    height: brush.height,
    shape: brush.type,
    color: e.buttons == 1 ? brush.color.primary : brush.color.secondary,
    color1: brush.color.primary,
    color2: brush.color.secondary,
    alpha: brush.opacity/100,
    operation: brush.operation,
    effect: brush.effect
  }
}

const draw = (ctx: CanvasRenderingContext2D, cfg: any, canvas: HTMLCanvasElement) => {
  makePath(ctx, cfg);
  
  lastX = cfg.x;
  lastY = cfg.y;
  switch(cfg.effect){
    case 'mirror-x' : return mirrorX(ctx, cfg, canvas); break;
    case 'mirror-y' : return mirrorY(ctx, cfg, canvas); break;
    case '' : return; break;
  }
}

const makePath = (ctx: CanvasRenderingContext2D, cfg: any,) => {
  ctx.globalCompositeOperation = cfg.operation;
  ctx.globalAlpha = cfg.alpha;
  ctx.fillStyle = cfg.color;
  ctx.strokeStyle = cfg.color;
  ctx.lineWidth = cfg.width;
  ctx.lineCap = cfg.shape;
  ctx.beginPath();

  if(cfg.shape === 'square'){
    ctx.rect(cfg.x - cfg.width / 2, cfg.y - cfg.width / 2, cfg.width, cfg.height);
  }
  else if(cfg.shape === 'round'){
    ctx.arc(cfg.x - cfg.width / 16, cfg.y - cfg.width / 16, cfg.width /2, 0, Math.PI * 2);
  }
  // connect pints when mouse moves fast
  // if (lastX && lastY && (cfg.x !== lastX || cfg.y !== lastY)) {
  //   ctx.moveTo(lastX, lastY);
  //   ctx.lineTo(cfg.x, cfg.y);
  // }
  ctx.closePath();
  ctx.fill();
  paths.push(cfg);
  // ctx.stroke(); 
}

const mirrorX = (ctx: CanvasRenderingContext2D, cfg: any, canvas: HTMLCanvasElement) => {
  let mirror_x : number = cfg.x;
  if(cfg.x < canvas.width / 2){
    mirror_x = canvas.width - cfg.x;
  }
  else if(cfg.x > canvas.width / 2){
    mirror_x = (canvas.width / 2) - (cfg.x - (canvas.width / 2));
  }
  let mirror_cfg = Object.assign({}, cfg, {x: mirror_x, effect: ''});
  makePath(ctx, mirror_cfg);
} 

const mirrorY = (ctx: CanvasRenderingContext2D, cfg: any, canvas: HTMLCanvasElement) => {
  let mirror_y : number = cfg.y;
  if(cfg.y < canvas.height / 2){
    mirror_y = canvas.height - cfg.y;
  }
  else if(cfg.y > canvas.height / 2){
    mirror_y= (canvas.height / 2) - (cfg.y - (canvas.height / 2));
  }
  let mirror_cfg = Object.assign({}, cfg, {y: mirror_y, effect: ''});
  makePath(ctx, mirror_cfg);
} 

const clearCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.clearRect(0, 0, canvas.offsetWidth || 0, canvas.offsetHeight || 0);
  paths = [];
}


const undoPath = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  let refresh_paths = paths.slice(0, -1);
  clearCanvas(ctx, canvas);
  refresh_paths.forEach(cfg => makePath(ctx, cfg));
}

const fitCanvas = (canvas: HTMLCanvasElement) => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth - 220;
}

const saveImageWithName = (canvas: HTMLCanvasElement) => {
  let file_name = prompt('File Name');
  if(file_name){
    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = file_name;
    link.click();
    link.remove();
  }
}

export const Canvas = ({}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brush, setBrush] = useState<IBrush>(INIT_BRUSH);
  const { data, setData } = useContext(DataContext);
  const [link, setLink] = useState<string>("");
  const downRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // init canvas dimensions and drawing context
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      setContext(ctx);
      fitCanvas(canvas);
      canvas.addEventListener("mousedown", e => {
        isDrawing = true;
        draw(ctx, getDrawConfig(e, brush), canvas);
      });
      canvas.addEventListener("mousemove", e => {
        if(isDrawing === true){
          draw(ctx, getDrawConfig(e, brush), canvas);
        }
      });
      canvas.addEventListener("mouseup", () => {
        isDrawing = false;
      });
      canvas.addEventListener("mouseleave", () => {
        isDrawing = false;
      });
      canvas.addEventListener("contextmenu", e => e.preventDefault());
      window.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key == "z") {
          undoPath(ctx, canvas);
        }
      })
      window.addEventListener('clear-canvas', () => clearCanvas(ctx, canvas));
      window.addEventListener('resize', () => fitCanvas(canvas));
      window.addEventListener('save-as', () => saveImageWithName(canvas));
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <canvas
          className={styles.container}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};
