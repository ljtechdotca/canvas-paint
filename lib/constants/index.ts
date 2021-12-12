import { IBrush } from "@types";

export const INIT_BRUSH: IBrush = {
  color: {
    primary: "#000000",
    secondary: "#ffffff",
  },
  opacity: 100,
  width: 10,
  height: 10,
  type: "round",
  operation: "source-over"
};
