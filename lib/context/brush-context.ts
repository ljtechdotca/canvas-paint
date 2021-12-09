import { INIT_BRUSH } from "@lib/constants";
import { IBrush } from "@types";
import { createContext, Dispatch, SetStateAction } from "react";

export const BrushContext = createContext<{
  brush: IBrush;
  setBrush: Dispatch<SetStateAction<IBrush>>;
}>({ brush: INIT_BRUSH, setBrush: () => {} });
