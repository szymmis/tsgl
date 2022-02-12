class AssetLoader {
  public loadImageSync(src: string) {
    const img = new Image();
    img.src = src;
    return img;
  }

  public async loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = this.loadImageSync(src);
      img.onload = () => resolve(img);
    });
  }
}

export default new AssetLoader();
