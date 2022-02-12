import fontJSON from '@assets/font/font.json';
import fontTextureSource from '@assets/font/font.png';
import Utils from '@libs/Utils';
import AssetLoader from '@src/libs/loaders/AssetLoader';
import ShaderLoader from '@src/libs/loaders/ShaderLoader';
import { Region, TSGLInitialOptions } from '@src/ts';

import Font from './libs/Font';

export function init(canvas: HTMLCanvasElement, options?: TSGLInitialOptions) {
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
    translation: gl.getUniformLocation(program, 'u_translation'),
    scale: gl.getUniformLocation(program, 'u_scale'),
    rotation: gl.getUniformLocation(program, 'u_rotation'),
    region: gl.getUniformLocation(program, 'u_region'),
    textureSize: gl.getUniformLocation(program, 'u_textureSize'),
    worldScale: gl.getUniformLocation(program, 'u_worldScale'),
  };

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(uniforms.worldScale, 2, 2);

  const buffers = {
    texCoord: Utils.bindAttribWithBuffer(gl, program, 'a_texCoord'),
  };

  Utils.insertBufferData(
    gl,
    buffers.texCoord,
    [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
  );

  Utils.createAndBindTexture(gl);
  const setImage = (img: HTMLImageElement, region?: Region) => {
    Utils.setImage(gl, img);
    const { x, y, width, height } = region ?? {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    };
    gl.uniform4f(uniforms.region, x, y, width, height);
    gl.uniform2f(uniforms.textureSize, img.width, img.height);
  };

  const drawRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    rotation = 0,
  ) => {
    gl.uniform2f(uniforms.translation, x, y);
    gl.uniform2f(uniforms.scale, width, height);
    gl.uniform1f(uniforms.rotation, rotation);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const font = new Font(
    AssetLoader.loadImageSync(fontTextureSource),
    JSON.parse(fontJSON),
  );

  return {
    setImage,
    drawRect,
    drawText: (text: string, x: number, y: number) =>
      font.drawText(gl, uniforms, text, x, y),
    loadImage: AssetLoader.loadImage,
  };
}
