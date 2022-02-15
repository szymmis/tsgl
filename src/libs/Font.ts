import { FontConfig, FontGlyphsSet } from '@src/ts/Font';
import { AttributeSet } from '@ts/WebGL';

import { Batch } from './Batch';

export class Font {
  public glyphs: FontGlyphsSet;

  constructor(config: FontConfig) {
    const customSizes = Object.entries(config.customSize ?? {});

    this.glyphs = Object.fromEntries(
      (config.letters ?? '').split('').map((letter, indx) => {
        let size = config.defaultSize ?? 0;
        customSizes.forEach(([setSize, characters]) => {
          if (characters.indexOf(letter) >= 0) size = Number(setSize);
        });

        return [
          letter,
          {
            offset: indx * 6,
            size,
          },
        ];
      }),
    );
  }

  drawText(
    gl: WebGL2RenderingContext,
    attributes: AttributeSet,
    text: string,
    x: number,
    y: number,
  ) {
    text
      .toLowerCase()
      .split('')
      .reduce((totalOffset, letter) => {
        if (letter !== ' ') {
          const character = this.glyphs[letter];
          if (character) {
            const { offset, size = 5 } = character;
            Batch.queue(gl, attributes, x + totalOffset, y, 6, 9, 0, {
              x: offset,
              y: 0,
              width: 6,
              height: 9,
            });
            return totalOffset + size;
          }
        }
        return totalOffset + 2;
      }, 0);
  }
}
