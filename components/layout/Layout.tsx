import { Canvas, Header, Tools } from "@components";
import { INIT_BRUSH } from "@lib/constants";
import { BrushContext, DataContext } from "@lib/context";
import { IBrush } from "@types";
import { useState } from "react";
export interface LayoutProps {}

export const Layout = ({}: LayoutProps) => {
  const [brush, setBrush] = useState<IBrush>(INIT_BRUSH);
  const [data, setData] = useState("");

  return (
    <BrushContext.Provider value={{ brush, setBrush }}>
      <DataContext.Provider value={{ data, setData }}>
        <Header />
        <div className="flex">
          <Canvas />
          <Tools />
        </div>
      </DataContext.Provider>
    </BrushContext.Provider>
  );
};
