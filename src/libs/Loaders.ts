// const ASSETS_PATH = '../../assets';
// const IMAGES_PATH = `${ASSETS_PATH}/images`;

import vertex from '@assets/shaders/vertex.glsl';
import fragment from '@assets/shaders/fragment.glsl';

export const ShaderLoader = { vertex, fragment };

function loadImageSync(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}

async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = loadImageSync(src);
    img.onload = () => resolve(img);
  });
}

export const AssetLoader = {
  loadImage,
  loadImageSync,
};
