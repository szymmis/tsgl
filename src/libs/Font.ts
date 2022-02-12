import { FontConfig, FontGlyphsSet } from '@src/ts/Font';
import Utils from '@libs/Utils';

export default class Font {
  public texture: HTMLImageElement;
  public glyphs: FontGlyphsSet;

  constructor(texture: HTMLImageElement, config: FontConfig) {
    this.texture = texture;

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
    uniforms: Record<string, WebGLUniformLocation | null>,
    text: string,
    x: number,
    y: number,
  ) {
    Utils.setImage(gl, this.texture);
    gl.uniform2f(uniforms.textureSize, this.texture.width, this.texture.height);

    gl.uniform1f(uniforms.rotation, 0);
    gl.uniform2f(uniforms.scale, 6, 9);

    text
      .toLowerCase()
      .split('')
      .reduce((totalOffset, letter) => {
        if (letter !== ' ') {
          const character = this.glyphs[letter];
          if (character) {
            const { offset, size = 5 } = character;
            gl.uniform4f(uniforms.region, offset, 0, 6, 9);
            gl.uniform2f(uniforms.translation, x + totalOffset, y);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            return totalOffset + size;
          }
        }
        return totalOffset + 2;
      }, 0);
  }
}
