export interface IColor {
  primary: string;
  secondary: string;
}

export interface IBrush {
  color: IColor;
  opacity: number;
  width: number;
  height: number;
  type: string;
  operation: string,
  effect: string
}
