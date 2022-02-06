export interface TSGLInitialOptions {
  width?: number;
  height?: number;
  clearColor?: { r: number; g: number; b: number };
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TSGLInstance {
  loadImage: (src: string) => Promise<HTMLImageElement>;
  setImage: (img: HTMLImageElement, region?: Region) => void;
  drawRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
  ) => void;
  drawText: (text: string, x: number, y: number) => void;
}

export function init(
  canvas: HTMLCanvasElement,
  option?: TSGLInitialOptions,
): TSGLInstance | undefined;
