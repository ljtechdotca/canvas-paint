import { createContext, Dispatch } from "react";

export const DataContext = createContext<{
  data: string;
  setData: Dispatch<string>;
}>({ data: "", setData: () => {} });
