import { TSGLRegion, TSGLTexture } from '@src/ts';

export class Texture implements TSGLTexture {
  private x: number;
  private y: number;

  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public getSubtexture(
    x = 0,
    y = 0,
    width: number = this.width,
    height: number = this.height,
  ): TSGLRegion {
    return { x: this.x + x, y: this.y + y, width, height };
  }
}
