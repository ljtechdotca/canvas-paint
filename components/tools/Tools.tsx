import { BrushContext } from "@lib/context";
import { IBrush } from "@types";
import { DataContext } from "@lib/context";
import { useContext, useState } from "react";
import styles from "./Tools.module.scss";
export interface ToolsProps {}

export const Tools = ({}: ToolsProps) => {
  const { brush, setBrush } = useContext(BrushContext);
  const [brushData, setBrushData] = useState<IBrush>(brush);
  const { data, setData } = useContext(DataContext);

  const handleBrush = (key: string, value: string) => {
    let newBrush = brush;
    console.log("Changing Parameter", key, value);
    switch (key) {
      case "primary":
      newBrush.color.primary = value;
        setBrush(newBrush);
        return;
      case "secondary":
        newBrush.color.secondary = value;
        setBrush(newBrush);
        return;
      case "type":
        newBrush.type = value;
        setBrush(newBrush);
        return;
      case "size":
        newBrush.height = parseInt(value);
        newBrush.width = parseInt(value);
        setBrush(newBrush);
        return;
      case "opacity":
        newBrush.opacity = parseInt(value);
        setBrush(newBrush);
        return;
      case "operation":
        newBrush.operation = value;
        setBrush(newBrush);
          return;
      default:
        break;
    }
  };

  return (
    <aside className={styles.root}>
      <div className={styles.container}>
        <fieldset className={styles.field}>
          <label htmlFor="colors" className={styles.label}>
            Brush Color
          </label>
          <div>
            <input
              className={styles.input}
              type="color"
              name="primary"
              id="primary"
              value={brushData.color.primary}
              onChange={(event) => {
                handleBrush("primary", event.target.value);
                setBrushData((state) => ({
                  ...state,
                  color: {
                    ...state.color,
                    primary: event.target.value,
                  },
                }));
              }}
            />
            <input
              className={styles.input}
              type="color"
              name="secondary"
              id="secondary"
              value={brushData.color.secondary}
              onChange={(event) => {
                handleBrush("secondary", event.target.value);
                setBrushData((state) => ({
                  ...state,
                  color: {
                    ...state.color,
                    secondary: event.target.value,
                  },
                }));
              }}
            />
          </div>
        </fieldset>
        <fieldset className={styles.field}>
        <label htmlFor="type" className={styles.label}>
            Brush Shape
          </label>
          <select
            className={styles.select}
            name="type"
            id="type"
            onChange={(event) => {
              handleBrush("type", event.target.value);
              setBrushData((state) => ({
                ...state,
                type: event.target.value,
              }));
            }}
          >
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </fieldset>
        <fieldset className={styles.field}>
          <label htmlFor="size" className={styles.label}>
            Brush Size {brushData.width}
          </label>
          <input
            className={styles.input}
            type="range"
            name="size"
            id="size"
            min={10}
            max={100}
            value={brushData.width}
            onChange={(event) => {
              handleBrush("size", event.target.value);
              setBrushData((state) => ({
                ...state,
                height: parseInt(event.target.value),
                width: parseInt(event.target.value),
              }));
            }}
          />
        </fieldset>
        <fieldset className={styles.field}>
          <label htmlFor="opacity" className={styles.label}>
            Brush Opacity {brushData.opacity}
          </label>
          <input
            className={styles.input}
            type="range"
            name="opacity"
            id="opacity"
            min={1}
            max={100}
            value={brushData.opacity}
            onChange={(event) => {
              handleBrush("opacity", event.target.value);
              setBrushData((state) => ({
                ...state,
                opacity: parseInt(event.target.value),
              }));
            }}
          />
        </fieldset>
        <fieldset className={styles.field}>
          <label htmlFor="operation" className={styles.label}>
            Draw Operation
          </label>
          <select className={styles.input} name="operation" id="operation" onChange={(event) => {
            handleBrush("operation", event.target.value);
            setBrushData((state) => ({
              ...state,
              operation: event.target.value
            }));
          }}>
            <option value="source-over">source-over</option>
            <option value="source-in">source-in</option>
            <option value="source-out">source-out</option>
            <option value="source-atop">source-over</option>
            <option value="detination-over">source-over</option>
            <option value="destination-in">destination-in</option>
            <option value="destination-out">destination-out</option>
            <option value="destination-over">destination-over</option>
            <option value="lighter">lighter</option>
            <option value="copy">copy</option>
            <option value="xor">xor</option>
            <option value="multiply">multiply</option>
            <option value="screen">screen</option>
            <option value="overlay">overlay</option>
            <option value="darken">darken</option>
            <option value="lighten">lighten</option>
            <option value="color-dodge">color-dodge</option>
            <option value="color-burn">color-burn</option>
            <option value="hard-light">hard-light</option>
            <option value="soft-light">soft-light</option>
            <option value="difference">difference</option>
            <option value="exclusion">exclusion</option>
            <option value="hue">hue</option>
            <option value="saturation">saturation</option>
            <option value="color">color</option>
            <option value="luminosity">luminosity</option>
          </select>
        </fieldset>
        <fieldset>
        </fieldset>
        <div className={styles.field}>
          <div className={styles.label}>Brush Preview</div>
          <div className={styles.window}>
            <span
              className={styles.brush}
              style={{
                opacity: `${brushData.opacity / 100}`,
                height: brushData.height,
                width: brushData.width,
                borderRadius: brushData.type == "round" ? "100%" : "0px",
              }}
            />
          </div>
        </div>
        <fieldset>
          <a
            download={"my-pretty-image.png"}
            href={data.replace("image/png", "image/octet-stream")}
            className={styles.download}
          >
            Download Image
          </a>
        </fieldset>
        <fieldset>
          <button onClick={e => window.dispatchEvent(new CustomEvent('clear-canvas'))}>Clear Canvas</button>
        </fieldset>
      </div>
    </aside>
  );
};
