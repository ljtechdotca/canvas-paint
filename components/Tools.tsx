import { BrushContext } from "@lib/context";
import { IBrush } from "@types";
import { DataContext } from "@lib/context";
import { useContext, useState } from "react";
export interface ToolsProps {}

export const Tools = ({}: ToolsProps) => {
  const { brush, setBrush } = useContext(BrushContext);
  const [brushData, setBrushData] = useState<IBrush>(brush);
  const { data, setData } = useContext(DataContext);
  const [section_other_collapsed, setSectionOtherCollapsed] = useState(false);
  const [section_brush_configuration_collapsed, sectionBrushConfigurationCollapsed] = useState(false);

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
      case "effect":
        newBrush.effect = value;
        setBrush(newBrush);
          return;
      default:
        break;
    }
  };

  return (
    <aside id='tools'>
        <div className='tools-section'>
          <div className='section-label' onClick={() => sectionBrushConfigurationCollapsed(!section_brush_configuration_collapsed) }>Brush Configuration</div>
          {  section_brush_configuration_collapsed ?
            ""
            :
            <div className='section-content'>
              <fieldset>
                <label htmlFor="colors">
                  Brush Color
                </label>
                <div>
                  <input
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
              <fieldset>
              <label htmlFor="type">
                  Brush Shape
                </label>
                <select
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
              <fieldset>
                <label htmlFor="size">
                  Brush Size {brushData.width}
                </label>
                <input
                  type="range"
                  name="size"
                  id="size"
                  min={1}
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
              <fieldset>
                <label htmlFor="opacity">
                  Brush Opacity {brushData.opacity}
                </label>
                <input
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
              <fieldset>
                <label htmlFor="operation">
                  Draw Operation
                </label>
                <select name="operation" id="operation" onChange={(event) => {
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
                <label htmlFor="effect">
                  Effect
                </label>
                <select name="effect" id="effect" onChange={(event) => {
                  handleBrush("effect", event.target.value);
                  setBrushData((state) => ({
                    ...state,
                    effect: event.target.value
                  }));
                }}>
                  <option value="">none</option>
                  <option value="mirror-x">mirror-x</option>
                  <option value="mirror-y">mirror-y</option>
                </select>
              </fieldset>
              <fieldset>
              </fieldset>
          </div>
        }
      </div>
      <div className='tools-section'>
        <div className='section-label' onClick={() => setSectionOtherCollapsed(!section_other_collapsed)}>Other</div>
        { 
          section_other_collapsed ?
          ""
          :
          <div className='section-content'>
            <fieldset>
              <button onClick={e => window.dispatchEvent(new CustomEvent('clear-canvas'))}>Clear Canvas</button>
            </fieldset>
          </div>
        }
      </div>
    </aside>
  );
};
