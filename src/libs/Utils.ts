class Utils {
  createShader(
    gl: WebGL2RenderingContext,
    type: typeof gl.VERTEX_SHADER | typeof gl.FRAGMENT_SHADER,
    shaderSource: string,
  ) {
    const shader = gl.createShader(type);
    if (!shader) return;

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  public createProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ) {
    const vertex = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  public bindAttribWithBuffer(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    attribName: string,
    size = 2,
  ) {
    const pos = gl.getAttribLocation(program, attribName);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, size, gl.FLOAT, false, 0, 0);

    return buffer;
  }

  public createAndBindTexture(gl: WebGL2RenderingContext) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  }

  public setImage(gl: WebGL2RenderingContext, image: HTMLImageElement) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  public insertBufferData(
    gl: WebGL2RenderingContext,
    buffer: WebGLBuffer | null,
    data: number[],
  ) {
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
  }
}

export default new Utils();
