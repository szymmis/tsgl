export const AssetLoader = {
  loadImageSync(src: string) {
    const img = new Image();
    img.src = src;
    return img;
  },

  async loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = this.loadImageSync(src);
      img.onload = () => resolve(img);
    });
  },
};
