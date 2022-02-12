import fontJSON from '@assets/font/font.json';
import fontTextureSource from '@assets/font/font.png';
import Utils from '@libs/Utils';
import AssetLoader from '@src/libs/loaders/AssetLoader';
import ShaderLoader from '@src/libs/loaders/ShaderLoader';
import { TSGLDrawOptions, TSGLInitialOptions } from '@src/ts/index';

import Font from './libs/Font';
import { Texture } from './libs/Texture';

class TSGL {
  private spriteBatch: HTMLImageElement = new Image();
  private __textCoord: number[] = [];
  private __translation: number[] = [];
  private __rotation: number[] = [];
  private __scale: number[] = [];
  private __region: number[] = [];

  public init(canvas: HTMLCanvasElement, options?: TSGLInitialOptions) {
    canvas.width = options?.width ?? 800;
    canvas.height = options?.height ?? 600;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const program = Utils.createProgram(
      gl,
      ShaderLoader.vertex,
      ShaderLoader.fragment,
    );
    if (!program) return;

    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      textureSize: gl.getUniformLocation(program, 'u_textureSize'),
      worldScale: gl.getUniformLocation(program, 'u_worldScale'),
    };

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uniforms.worldScale, 2, 2);

    const buffers = {
      texCoord: Utils.bindAttribWithBuffer(gl, program, 'a_texCoord'),
      translation: Utils.bindAttribWithBuffer(gl, program, 'a_translation'),
      rotation: Utils.bindAttribWithBuffer(gl, program, 'a_rotation', 1),
      scale: Utils.bindAttribWithBuffer(gl, program, 'a_scale'),
      region: Utils.bindAttribWithBuffer(gl, program, 'a_region', 4),
    };

    const createTexture = async (src: string) => {
      const img = await AssetLoader.loadImage(src);

      return new Promise((resolve, reject) => {
        const combinedTexture = Utils.concatImages(this.spriteBatch, img);
        if (!combinedTexture) return reject();

        combinedTexture.onload = () => {
          this.spriteBatch = combinedTexture;
          Utils.createAndBindTexture(gl);
          Utils.setImage(gl, this.spriteBatch);
          gl.uniform2f(
            uniforms.textureSize,
            this.spriteBatch.width,
            this.spriteBatch.height,
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
    };

    const font = new Font(
      AssetLoader.loadImageSync(fontTextureSource),
      JSON.parse(fontJSON),
    );

    const drawImage = (
      img: Texture,
      x: number,
      y: number,
      options?: TSGLDrawOptions,
    ) => {
      this.__textCoord.push(
        0.0,
        1.0,
        1.0,
        1.0,
        1.0,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
      );
      const region = options?.region;
      const computedRegion = img.getSubtexture(
        region?.x,
        region?.y,
        region?.width,
        region?.height,
      );
      for (let i = 0; i < 6; i++) {
        this.__translation.push(x, y);
        this.__rotation.push(options?.rotation ?? 0);
        this.__scale.push(
          options?.width ?? img.width,
          options?.height ?? img.height,
        );
        this.__region.push(
          computedRegion.x,
          computedRegion.y,
          computedRegion.width,
          computedRegion.height,
        );
      }
    };

    const commitGraphics = () => {
      Utils.insertBufferData(gl, buffers.texCoord, this.__textCoord);
      Utils.insertBufferData(gl, buffers.translation, this.__translation);
      Utils.insertBufferData(gl, buffers.rotation, this.__rotation);
      Utils.insertBufferData(gl, buffers.scale, this.__scale);
      Utils.insertBufferData(gl, buffers.region, this.__region);
      gl.drawArrays(gl.TRIANGLES, 0, this.__rotation.length);
      this.__textCoord.length = 0;
      this.__translation.length = 0;
      this.__rotation.length = 0;
      this.__scale.length = 0;
      this.__region.length = 0;
    };

    return {
      createTexture,
      drawImage,
      drawText: (text: string, x: number, y: number) =>
        font.drawText(gl, uniforms, text, x, y),
      commitGraphics,
    };
  }
}

export = new TSGL();
