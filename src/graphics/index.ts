import { ShaderLoader } from '@src/loaders/shaders';
import { CanvasInitOptions } from '@ts/graphics';
import { Utils } from '@src/graphics/utils';

export function init(canvas: HTMLCanvasElement, options?: CanvasInitOptions) {
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
  };

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);

  const buffers = {
    texCoord: Utils.bindAttribWithBuffer(gl, program, 'a_texCoord'),
  };

  Utils.insertBufferData(
    gl,
    buffers.texCoord,
    [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
  );

  Utils.createAndBindTexture(gl);

  return {
    setImage: (img: HTMLImageElement) => Utils.setImage(gl, img),
    drawRect: (
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
    },
  };
}
