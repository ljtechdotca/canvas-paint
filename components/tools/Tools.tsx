import { BrushContext } from "@lib/context";
import { IBrush } from "@types";
import { useContext, useState } from "react";
import styles from "./Tools.module.scss";
export interface ToolsProps {}

export const Tools = ({}: ToolsProps) => {
  const { brush, setBrush } = useContext(BrushContext);
  const [brushData, setBrushData] = useState<IBrush>(brush);

  const handleBrush = (key: string, value: string) => {
    let newBrush = brush;
    switch (key) {
      case "primary":
        console.log("primary");
        newBrush.color.primary = value;
        setBrush(newBrush);
        return;
      case "secondary":
        console.log("secondary");
        newBrush.color.secondary = value;
        setBrush(newBrush);
        return;
      case "type":
        console.log("type");
        newBrush.type = value;
        setBrush(newBrush);
        console.log(newBrush);
        return;
      case "size":
        console.log("size");
        newBrush.height = parseInt(value);
        newBrush.width = parseInt(value);
        setBrush(newBrush);
        return;
      case "opacity":
        console.log("opacity");
        newBrush.opacity = parseInt(value);
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
          <div className={styles.colors}>
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
            <option value="arc">arc</option>
            <option value="square">square</option>
          </select>
        </fieldset>
        <fieldset className={styles.field}>
          <label htmlFor="size" className={styles.label}>
            size
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
            opacity
          </label>
          <input
            className={styles.input}
            type="range"
            name="size"
            id="size"
            min={1}
            max={100}
            value={brushData.opacity}
            onChange={(event) => {
              handleBrush("size", event.target.value);
              setBrushData((state) => ({
                ...state,
                opacity: parseInt(event.target.value),
              }));
            }}
          />
        </fieldset>
        <div className={styles.field}>
          <div className={styles.label}>brush</div>
          <div className={styles.window}>
            <span
              className={styles.brush}
              style={{
                opacity: `${brushData.opacity / 100}`,
                height: brushData.height,
                width: brushData.width,
                borderRadius: brushData.type == "arc" ? "9999px" : "0px",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
