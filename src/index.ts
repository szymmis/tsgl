import { Batch } from '@libs/Batch';
import { Instance } from '@libs/Instance';
import { Utils } from '@libs/Utils';
import { ShaderLoader } from '@src/libs/loaders/ShaderLoader';
import { TSGLInitialOptions } from '@src/ts/index';
import { AttributeSet, UniformSet } from '@ts/WebGL';

const TSGL = {
  init(canvas: HTMLCanvasElement, options?: TSGLInitialOptions) {
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

    const UNIFORMS: UniformSet = {
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

    const ATTRIBUTES: AttributeSet = {
      texCoord: Utils.bindAttribWithBuffer(gl, program, 'a_texCoord'),
      translation: Utils.bindAttribWithBuffer(gl, program, 'a_translation'),
      rotation: Utils.bindAttribWithBuffer(gl, program, 'a_rotation', 1),
      scale: Utils.bindAttribWithBuffer(gl, program, 'a_scale'),
      region: Utils.bindAttribWithBuffer(gl, program, 'a_region', 4),
    };

    const loop = () => {
      Batch.paint(gl, ATTRIBUTES);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return new Instance(gl, UNIFORMS, ATTRIBUTES);
  },
};

export = TSGL;
