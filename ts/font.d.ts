interface FontGlyph {
  offset: number;
  size: number;
}

export type FontGlyphsSet = Record<string, FontGlyph>;

export type FontConfig = Partial<{
  letters: string;
  defaultSize: number;
  customSize: Record<number, string>;
}>;
