// const ASSETS_PATH = '../../assets';
// const IMAGES_PATH = `${ASSETS_PATH}/images`;

export function loadImageSync(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}

export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = loadImageSync(src);
    img.onload = () => resolve(img);
  });
}
