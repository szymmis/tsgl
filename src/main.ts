import * as TSGL from './graphics/index';
import { loadImage } from './loaders/index';

import asset from '../assets/images/sprite.png';

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const tsgl = TSGL.init(canvas, {
    clearColor: { r: 1, g: 1, b: 1 },
  });

  tsgl?.setImage(await loadImage(asset));

  const rects = [...new Array(15000)].map(() => {
    const size = 2 ** (Math.random() * 4) + 16;
    return [
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      size,
      size,
    ];
  });

  let time = 0;

  function loop() {
    if (!tsgl) return console.error('!!!');

    rects.forEach(([x, y, w, h]) => {
      tsgl.drawRect(x, y, w, h, (Math.PI / 180) * -time);
    });

    time++;

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
