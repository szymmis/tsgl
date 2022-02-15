import fontJSON from '@assets/font/font.json';
import fontTextureSource from '@assets/font/font.png';
import { Font } from '@libs/Font';
import { Texture } from '@libs/Texture';
import { Utils } from '@libs/Utils';
import { AssetLoader } from '@src/libs/loaders/AssetLoader';
import { ShaderLoader } from '@src/libs/loaders/ShaderLoader';
import { TSGLDrawOptions, TSGLInitialOptions } from '@src/ts/index';
import {
  Attribute,
  AttributesDataArrays,
  AttributesSet,
  UniformsSet,
} from '@ts/WebGL';

const POINTS_PER_SHAPE = 6;
const ARRAY_SIZE = 2500;
const ATTRIBUTE_SIZES: Record<Attribute, number> = {
  region: 4 * POINTS_PER_SHAPE,
  rotation: 1 * POINTS_PER_SHAPE,
  scale: 2 * POINTS_PER_SHAPE,
  texCoord: 2 * POINTS_PER_SHAPE,
  translation: 2 * POINTS_PER_SHAPE,
};

class TSGL {
  private pointer = 0;

  private spriteBatch: HTMLImageElement = new Image();

  private attributesArrays: AttributesDataArrays = {
    region: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.region),
    rotation: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.rotation),
    scale: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.scale),
    texCoord: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.texCoord),
    translation: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.translation),
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

    const UNIFORMS: UniformsSet = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      textureSize: gl.getUniformLocation(program, 'u_textureSize'),
      worldScale: gl.getUniformLocation(program, 'u_worldScale'),
    };

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(UNIFORMS.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(
      UNIFORMS.worldScale,
      options?.worldScale?.x || 2,
      options?.worldScale?.y || 2,
    );

    const ATTRIBUTES: AttributesSet = {
      texCoord: Utils.bindAttribWithBuffer(gl, program, 'a_texCoord'),
      translation: Utils.bindAttribWithBuffer(gl, program, 'a_translation'),
      rotation: Utils.bindAttribWithBuffer(gl, program, 'a_rotation', 1),
      scale: Utils.bindAttribWithBuffer(gl, program, 'a_scale'),
      region: Utils.bindAttribWithBuffer(gl, program, 'a_region', 4),
    };

    const font = new Font(
      AssetLoader.loadImageSync(fontTextureSource),
      JSON.parse(fontJSON),
    );

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

    const getAttributePointerLocation = (attr: Attribute) => {
      return this.pointer * ATTRIBUTE_SIZES[attr];
    };

    const setAttributeData = (attr: Attribute, data: ArrayLike<number>) => {
      this.attributesArrays[attr].set(data, getAttributePointerLocation(attr));
    };

    const drawImage = (
      img: Texture,
      x: number,
      y: number,
      options?: TSGLDrawOptions,
    ) => {
      const region = options?.region;
      const rotation = options?.rotation || 0;
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

      setAttributeData(
        'texCoord',
        [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
      );
      setAttributeData('translation', [x, y, x, y, x, y, x, y, x, y, x, y]);
      setAttributeData('rotation', [
        rotation,
        rotation,
        rotation,
        rotation,
        rotation,
        rotation,
      ]);
      setAttributeData('scale', [
        width,
        height,
        width,
        height,
        width,
        height,
        width,
        height,
        width,
        height,
        width,
        height,
      ]);
      setAttributeData('region', [
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
        computedRegion.x,
        computedRegion.y,
        computedRegion.width,
        computedRegion.height,
      ]);

      if (++this.pointer === ARRAY_SIZE - POINTS_PER_SHAPE) drawBatch();
    };

    const drawBatch = () => {
      Object.entries(this.attributesArrays).forEach(([key, data]) => {
        Utils.insertBufferData(gl, ATTRIBUTES[key as Attribute], data);
      });
      gl.drawArrays(gl.TRIANGLES, 0, this.pointer * 6);
      this.pointer = 0;
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
