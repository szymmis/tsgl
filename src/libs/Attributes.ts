import { Attribute, AttributeDataSet, AttributeSet } from '@ts/WebGL';

import { MemoryPointer } from './MemoryPointer';
import { Utils } from './Utils';

export const POINTS_PER_SHAPE = 6;
export const ARRAY_SIZE = 2500;

const ATTRIBUTE_SIZES: Record<Attribute, number> = {
  region: 4 * POINTS_PER_SHAPE,
  rotation: 1 * POINTS_PER_SHAPE,
  scale: 2 * POINTS_PER_SHAPE,
  texCoord: 2 * POINTS_PER_SHAPE,
  translation: 2 * POINTS_PER_SHAPE,
};

const ATTRIBUTE_ARRAYS: AttributeDataSet = {
  region: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.region),
  rotation: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.rotation),
  scale: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.scale),
  texCoord: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.texCoord),
  translation: new Float32Array(ARRAY_SIZE * ATTRIBUTE_SIZES.translation),
};

function getAttributePointerLocation(attr: Attribute) {
  return MemoryPointer.index * ATTRIBUTE_SIZES[attr];
}

export const Attributes = {
  set(attr: Attribute, data: ArrayLike<number>) {
    ATTRIBUTE_ARRAYS[attr].set(data, getAttributePointerLocation(attr));
  },

  insertBufferData(gl: WebGL2RenderingContext, atributes: AttributeSet) {
    Object.entries(ATTRIBUTE_ARRAYS).forEach(([key, data]) => {
      Utils.insertBufferData(gl, atributes[key as Attribute], data);
    });
  },
};
