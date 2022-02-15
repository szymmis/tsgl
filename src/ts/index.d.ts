export interface TSGLInitialOptions {
  width?: number;
  height?: number;
  worldScale?: { x: number; y: number };
  clearColor?: { r: number; g: number; b: number };
}

export interface TSGLRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TSGLTexture {
  width: number;
  height: number;
  getSubtexture: (
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  ) => TSGLRegion;
}

export function init(
  canvas: HTMLCanvasElement,
  option?: TSGLInitialOptions,
): TSGLInstance | undefined;

export interface TSGLDrawOptions {
  width?: number;
  height?: number;
  rotation?: number;
  region?: TSGLRegion;
}

export interface TSGLInstance {
  createTexture: (src: string) => Promise<TSGLTexture>;
  drawImage: (
    img: TSGLImage,
    x: number,
    y: number,
    options?: TSGLDrawOptions,
  ) => void;
  drawText: (text: string, x: number, y: number) => void;
  commitGraphics: () => void;
}
