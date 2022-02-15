export type Uniform = 'resolution' | 'textureSize' | 'worldScale';
export type Attribute =
  | 'texCoord'
  | 'translation'
  | 'rotation'
  | 'scale'
  | 'region';

export type UniformsSet = Record<Uniform, WebGLUniformLocation | null>;
export type AttributesSet = Record<Attribute, WebGLBuffer | null>;
export type AttributesDataArrays = Record<Attribute, Float32Array>;
