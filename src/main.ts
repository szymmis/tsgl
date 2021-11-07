import * as TSGL from './graphics/index';
import { loadImage } from './loaders/index';

import asset from '../assets/images/sprite.png';

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const tsgl = TSGL.init(canvas, {
    clearColor: { r: 1, g: 1, b: 1 },
  });

  if (!tsgl) return console.error("Couldn't load TSGL!");

  const img = await loadImage(asset);

  // const rects = [...new Array(15000)].map(() => {
  //   const size = 2 ** (Math.random() * 4) + 16;
  //   return [
  //     Math.random() * canvas.width,
  //     Math.random() * canvas.height,
  //     size,
  //     size,
  //   ];
  // });

  // let time = 0;

  const loop = () => {
    // rects.forEach(([x, y, w, h]) => {
    //   tsgl.drawRect(x, y, w, h, (Math.PI / 180) * -time);
    // });

    tsgl.setImage(img);
    tsgl.drawRect(10, 50, 100, 50);

    // time++;

    tsgl.drawText('(2+2)/5=32', 0, 27);
    tsgl.drawText('Odwiedź nas na https://www.google.pl/search?q=tsgl', 0, 18);
    tsgl.drawText('"Hello" world!!', 0, 9);
    tsgl.drawText('Witaj (podróżniku)', 0, 0);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
});
