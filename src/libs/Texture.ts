import { TSGLRegion, TSGLTexture } from '@src/ts';
import { UniformSet } from '@ts/WebGL';

import { Batch } from './Batch';
import { AssetLoader } from './loaders/AssetLoader';
import { Utils } from './Utils';

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
    region: TSGLRegion = { x: 0, y: 0, width: this.width, height: this.height },
  ): TSGLRegion {
    return {
      x: this.x + region.x,
      y: this.y + region.y,
      width: region.width,
      height: region.height,
    };
  }

  static async create(
    gl: WebGL2RenderingContext,
    uniforms: UniformSet,
    src: string,
  ): Promise<TSGLTexture> {
    const img = await AssetLoader.loadImage(src);

    return new Promise((resolve, reject) => {
      const combinedTexture = Utils.concatImages(Batch.sprite, img);
      if (!combinedTexture) return reject();

      combinedTexture.onload = () => {
        Batch.sprite = combinedTexture;
        Utils.createAndBindTexture(gl);
        Utils.setImage(gl, Batch.sprite);
        gl.uniform2f(
          uniforms.textureSize,
          Batch.sprite.width,
          Batch.sprite.height,
        );

        resolve(
          new Texture(
            combinedTexture.width - img.width,
            0,
            img.width,
            img.height,
          ),
        );
      };
    });
  }
}
