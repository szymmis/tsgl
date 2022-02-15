export type Uniform = 'resolution' | 'textureSize' | 'worldScale';
export type Attribute =
  | 'texCoord'
  | 'translation'
  | 'rotation'
  | 'scale'
  | 'region';

export type UniformSet = Record<Uniform, WebGLUniformLocation | null>;
export type AttributeSet = Record<Attribute, WebGLBuffer | null>;
export type AttributeDataSet = Record<Attribute, Float32Array>;
