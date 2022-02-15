import fontJSON from '@assets/font/font.json';
import fontTextureSource from '@assets/font/font.png';
import { Utils } from '@libs/Utils';
import { AssetLoader } from '@src/libs/loaders/AssetLoader';
import { ShaderLoader } from '@src/libs/loaders/ShaderLoader';
import { TSGLDrawOptions, TSGLInitialOptions } from '@src/ts/index';

import { Font } from './libs/Font';
import { Texture } from './libs/Texture';

type Uniform = 'resolution' | 'textureSize' | 'worldScale';
type Attribute = 'texCoord' | 'translation' | 'rotation' | 'scale' | 'region';

class TSGL {
  private spriteBatch: HTMLImageElement = new Image();
  private attributesData: Record<Attribute, number[]> = {
    region: [],
    rotation: [],
    scale: [],
    texCoord: [],
    translation: [],
  };

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

    const UNIFORMS: Record<Uniform, WebGLUniformLocation | null> = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      textureSize: gl.getUniformLocation(program, 'u_textureSize'),
      worldScale: gl.getUniformLocation(program, 'u_worldScale'),
    };

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(UNIFORMS.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(UNIFORMS.worldScale, 2, 2);

    const ATTRIBUTES: Record<Attribute, WebGLBuffer | null> = {
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
            UNIFORMS.textureSize,
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
      this.attributesData.texCoord.push(
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
      const { width, height } = {
        width: options?.width ?? img.width,
        height: options?.height ?? img.height,
      };
      const computedRegion = img.getSubtexture(
        region?.x,
        region?.y,
        region?.width,
        region?.height,
      );
      for (let i = 0; i < 6; i++) {
        this.attributesData.translation.push(x, y);
        this.attributesData.rotation.push(options?.rotation ?? 0);
        this.attributesData.scale.push(width, height);
        this.attributesData.region.push(
          computedRegion.x,
          computedRegion.y,
          computedRegion.width,
          computedRegion.height,
        );
      }

      if (this.attributesData.texCoord.length >= 5000) drawBatch();
    };

    const drawBatch = () => {
      const drawArraysLength = this.attributesData.texCoord.length / 2;
      Object.entries(this.attributesData).forEach(([key, data]) => {
        Utils.insertBufferData(gl, ATTRIBUTES[key as Attribute], data);
        data.length = 0;
      });
      gl.drawArrays(gl.TRIANGLES, 0, drawArraysLength);
    };

    const loop = () => {
      drawBatch();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return {
      createTexture,
      drawImage,
      drawText: (text: string, x: number, y: number) =>
        font.drawText(gl, UNIFORMS, text, x, y),
    };
  }
}

export = new TSGL();
