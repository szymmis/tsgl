import { TSGLDrawOptions, TSGLInstance, TSGLTexture } from '@ts/index';
import { AttributeSet, UniformSet } from '@ts/WebGL';

import { Batch } from './Batch';
import { font } from './Font';
import { Texture } from './Texture';

export class Instance implements TSGLInstance {
  private gl: WebGL2RenderingContext;
  private uniforms: UniformSet;
  private attributes: AttributeSet;

  constructor(
    gl: WebGL2RenderingContext,
    uniforms: UniformSet,
    attributes: AttributeSet,
  ) {
    this.gl = gl;
    this.uniforms = uniforms;
    this.attributes = attributes;
  }

  createTexture(src: string) {
    return Texture.create(this.gl, this.uniforms, src);
  }

  drawImage(img: TSGLTexture, x: number, y: number, options?: TSGLDrawOptions) {
    const rotation = options?.rotation || 0;
    const { width, height } = {
      width: options?.width ?? img.width,
      height: options?.height ?? img.height,
    };
    const region = img.getSubtexture(options?.region);
    Batch.queue(
      this.gl,
      this.attributes,
      x,
      y,
      width,
      height,
      rotation,
      region,
    );
  }

  drawText(text: string, x: number, y: number) {
    return font.drawText(this.gl, this.uniforms, text, x, y);
  }
}
