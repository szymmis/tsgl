import { TSGLRegion } from '@ts/index';
import { AttributeSet } from '@ts/WebGL';

import { Attributes } from './Attributes';
import { MemoryPointer } from './MemoryPointer';

export const Batch = {
  sprite: new Image(),

  paint(gl: WebGL2RenderingContext, attributes: AttributeSet) {
    Attributes.insertBufferData(gl, attributes);
    gl.drawArrays(gl.TRIANGLES, 0, MemoryPointer.index * 6);
    MemoryPointer.reset();
  },

  queue(
    gl: WebGL2RenderingContext,
    attributes: AttributeSet,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
    region: TSGLRegion,
  ) {
    Attributes.set(
      'texCoord',
      [0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    );
    Attributes.set('translation', [x, y, x, y, x, y, x, y, x, y, x, y]);
    Attributes.set('rotation', [
      rotation,
      rotation,
      rotation,
      rotation,
      rotation,
      rotation,
    ]);
    Attributes.set('scale', [
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
    Attributes.set('region', [
      region.x,
      region.y,
      region.width,
      region.height,
      region.x,
      region.y,
      region.width,
      region.height,
      region.x,
      region.y,
      region.width,
      region.height,
      region.x,
      region.y,
      region.width,
      region.height,
      region.x,
      region.y,
      region.width,
      region.height,
      region.x,
      region.y,
      region.width,
      region.height,
    ]);

    if (MemoryPointer.moveAndCheckEdge()) this.paint(gl, attributes);
  },
};
