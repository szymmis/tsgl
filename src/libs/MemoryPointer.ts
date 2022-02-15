import { ARRAY_SIZE, POINTS_PER_SHAPE } from './Attributes';

export const MemoryPointer = {
  index: 0,
  moveAndCheckEdge() {
    return ++this.index === ARRAY_SIZE - POINTS_PER_SHAPE;
  },
  reset() {
    this.index = 0;
  },
};
