import { INIT_BRUSH } from "@lib/constants";
import { DataContext } from "@lib/context";
import { IBrush } from "@types";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Canvas.module.scss";
export interface CanvasProps {}

var lastX : number | null;
var lastY : number | null;

const _arc = (context: CanvasRenderingContext2D) => {

  return {
    draw: function (x: number, y: number, r: number, color: string, opacity: number, operation: string) {
      context.globalCompositeOperation = operation;
      context.globalAlpha = opacity;
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
      context.closePath();
    },
  };
};

const _square = (context: CanvasRenderingContext2D) => {
  return {
    draw: function (x: number, y: number, w: number, h: number, color: string, opacity: number, operation: string) {
      context.globalCompositeOperation = operation;
      context.fillStyle = color;
      context.globalAlpha = opacity;
      context.beginPath();
      context.rect(x, y, w, h);
      context.fill();
      context.closePath();
    },
  };
};

const render = {
  arc: (context: CanvasRenderingContext2D) => _arc(context),
  square: (context: CanvasRenderingContext2D) => _square(context),
};

const draw_v2 = (ctx: CanvasRenderingContext2D, cfg: any) => {
  ctx.globalCompositeOperation = cfg.o;
  ctx.globalAlpha = cfg.a;
  ctx.fillStyle = cfg.c;
  ctx.strokeStyle = cfg.c;
  ctx.lineWidth = cfg.w;
  ctx.lineCap = cfg.t;

  ctx.beginPath();
  if(cfg.t === 'square'){
    ctx.rect(cfg.x - cfg.w / 2, cfg.y - cfg.w / 2, cfg.w, cfg.h);
  }
  else if(cfg.t === 'round'){
    ctx.arc(cfg.x - cfg.w / 16, cfg.y - cfg.w / 16, cfg.w /2, 0, Math.PI * 2);
  }
 
  // connect pints when mouse moves fast
  // if (lastX && lastY && (cfg.x !== lastX || cfg.y !== lastY)) {
  //   ctx.moveTo(lastX, lastY);
  //   ctx.lineTo(cfg.x, cfg.y);
  // }
  ctx.closePath();
  ctx.fill();
  // ctx.stroke();
  
  lastX = cfg.x;
  lastY = cfg.y;
}

const clearCanvas = (ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement | null ) => {
  ctx?.clearRect(0, 0, canvas?.offsetWidth || 0, canvas?.offsetHeight || 0);
}

export const Canvas = ({}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [brush, setBrush] = useState<IBrush>(INIT_BRUSH);
  const { data, setData } = useContext(DataContext);
  const [link, setLink] = useState<string>("");

  const mouseMove = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const down = downRef.current;
      if (context && down) {
        const { color, opacity, width, height, type, operation } = brush;
        const x = event.offsetX;
        const y = event.offsetY;
        const c = event.buttons == 1 ? `${color.primary}` : `${color.secondary}`;
        draw_v2(context, {
          t: type,
          x: x,
          y: y,
          w: width,
          h: height,
          c: c,
          a: opacity/100,
          o: operation
        });
       
        // switch (type) {
        //   case "arc":
        //     render
        //       .arc(context)
        //       .draw(x - width / 16, y - width / 16, width / 2, c, opacity/100, operation);
        //     break;
        //   case "square":
        //     render
        //       .square(context)
        //       .draw(x - width / 2, y - width / 2, width, height, c, opacity/100, operation);
        //     break;
        //   default:
        //     break;
        // }
      }
    },
    [brush, context]
  );

  const downRef = useRef<{ x: number; y: number } | null>(null);
  
  const mouseDown = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      downRef.current = { x: event.offsetX, y: event.offsetY };
      if (canvas) {
        canvas.addEventListener("mousemove", mouseMove);
      }
    },
    [mouseMove]
  );

  const mouseUp = useCallback(
    (event: MouseEvent) => {
      const canvas = canvasRef.current;
      const down = downRef.current;
      if (canvas && context && down) {
        const dataURL = canvas.toDataURL("image/png");
        setData(dataURL);
        canvas.removeEventListener("mousemove", mouseMove);
        downRef.current = null;
        lastX = null;
        lastY = null;
      }
    },
    [context, mouseMove, setData]
  );

  const clearMouse = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener("mousemove", mouseMove);
    }
  }, [mouseMove]);

  useEffect(() => {
    window.addEventListener("mousemove", clearMouse);
    return () => {
      window.removeEventListener("mousemove", clearMouse);
    };
  }, [clearMouse]);

  useEffect(() => {
    // init canvas dimensions and drawing context
    const canvas = canvasRef.current;
    const { innerHeight, innerWidth } = window;

    if (canvas) {
      const newContext = canvas.getContext("2d");
      setContext(newContext);
      canvas.width = innerWidth - 220;
      canvas.height = innerHeight;
      window.addEventListener('clear-canvas', () => clearCanvas(newContext, canvas))
    }
  }, []);

  const contextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      // todo - research globalCompositeOperation
      // context.globalCompositeOperation = "copy";

      canvas.addEventListener("mousedown", mouseDown);
      canvas.addEventListener("mouseup", mouseUp);
      return () => {
        canvas.removeEventListener("mousedown", mouseDown);
        canvas.removeEventListener("mouseup", mouseUp);
      };
    }
  }, [context, mouseDown, mouseUp]);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <canvas
          className={styles.container}
          ref={canvasRef}
          onContextMenu={contextMenu}
        />
      </div>
    </div>
  );
};
