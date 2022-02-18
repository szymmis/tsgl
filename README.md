# TSGL - Simple TypeScript WebGL Library

[![npm](https://img.shields.io/npm/v/@szymmis/tsgl)](https://www.npmjs.org/package/@szymmis/tsgl)
[![downloads-per-week](https://img.shields.io/npm/dt/@szymmis/tsgl?color=red)](https://www.npmjs.org/package/@szymmis/tsgl)
[![license](https://img.shields.io/npm/l/@szymmis/tsgl?color=purple)](https://www.npmjs.org/package/@szymmis/tsgl)

## Introduction

**TSGL** is a basic wrapper on **WebGL** primitive API. \
You don't need to worry about creating shaders, compiling programs etc.\
Simply create a **TSGLInstance** object with `init` function and use
it's exposed functions such as

- [`drawImage()`](#drawimageimg-x-y-options)
- [`drawText()`](#drawtexttext-x-y)

## Installation and usage

You can use **TSGL** in every possible way.

- as `ESModules` or `CommonJS` importable package with some kind of bundler (ex: `webpack`)
  - **Preferable because of built-in TypeScript typings**

```js
import TSGL from '@szymmis/tsgl'; // ESModules
// or
const TSGL = require('@szymmis/tsgl'); // CommonJS

(async function () {
  const canvas = document.querySelector('canvas');
  const tsgl = TSGL.init(canvas);
  const img = await tsgl.createTexture('img.png');
  tsgl.drawImage(img, 50, 50);
})();
```

- in browser by importing the script file and consuming `TSGL` object exposed globally

```html
<body>
  <canvas></canvas>
  <script src="PATH_TO_TSGL.js"></script>
  <script>
    (async function () {
      const canvas = document.querySelector('canvas');
      const tsgl = TSGL.init(canvas);
      const img = await tsgl.createTexture('img.png');
      tsgl.drawImage(img, 50, 50);
    })();
  </script>
</body>
```

## Documentation

| Available functions inside global `TSGL` object                               |
| ----------------------------------------------------------------------------- |
| [`init(canvas, options?) => TSGLInstance`](#initcanvas-options--tsglinstance) |

### `init(canvas, options?) => TSGLInstance`

Function used to create a `TSGLInstance` object and set up `WebGL` with
passed in canvas to draw on.\
You can specify options to control how
**TSGL** is initialised

**Parameters**

- **`canvas: HTMLCanvasElement`** - canvas on which the graphics will be rendered on
- **`options?: TSGLInitialOptions`** - (optional)
  - **`width?: number`** - (optional) width
  - **`height?: number`** - (optional) and height of the viewport
  - **`worldScale?: { x: number, y: number }`** - (optional) global scale factor, usefull when you want to upscale all graphics _x_ times
  - **`clearColor?: { r: number, g: number, b: number }`** - (optional) specifies the color of the canvas background color after every clear

**Example**

```js
// create TSGLInstance, and set the initial dimensions of the canvas to 800x600
const tsgl = TSGL.init(document.querySelector('canvas'), {
  width: 800,
  height: 600,
  worldScale: { x: 2, y: 2 },
});
```

| Available functions inside `TSGLInstance`                                         |
| --------------------------------------------------------------------------------- |
| [`async createTexture(src) => TSGLTexture`](#async-createtexturesrc--tsgltexture) |
| [`drawImage(img, x, y, options?)`](#drawimageimg-x-y-options)                     |
| [`drawText(text, x, y)`](#drawtexttext-x-y)                                       |

### `async createTexture(src) => TSGLTexture`

Function used to create a [`TSGLTexture`](#tsgltexture) from the file.\
It returns a promise that resolves to said texture object, which is used inside [`drawImage`](#drawimageimg-x-y-options) function.

**Parameters**

- **`src: string`** - path to an image file

**Example**

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  // load image from file and create texture object
  const img = await tsgl.createTexture('my_image.png');
})();
```

### `drawImage(img, x, y, options?)`

Function used to draw [`TSGLTexture`](#tsgltexture) onto the canvas

- **`img: TSGLTexture`** - texture to be drawn
- **`x: number`** - horizontal position of a texture
- **`y: number`** - vertical position
- **`options?: TSGLDrawOptions`** - (optional)
  - **`width?: number`** - (optional) width
  - **`height?: number`** - (optional) and height of the quad that the texture will be drawn on
  - **`rotation?: number`** - (optional) rotation in radians
  - **`region?: TSGLRegion`** - (optional) [region](#tsgltexture) of the texture to be rendered;
    used when you want to render a tile out of tileset or a frame of an animation

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  // load image from file and create texture object
  const img = await tsgl.createTexture('my_image.png');
  /*
   * draw the texture on a rect of size 100x100
   * on position (50,50)
   */
  tsgl.drawImage(img, 50, 50, { width: 100, height: 100 });
})();
```

### `drawText(text, x, y)`

Function used to draw text on a screen using built-in bitmap font

- **`text: string`** - A string to be drawn onto the screen
- **`x: number`** - horizontal
- **`y: number`** - and vertical position of the text

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  tsgl.drawText('Hello world!' 100, 100);
})();
```

### ⚠️ **Note** ⚠️

Only the basic ASCII characters as\
`aąbcćdeęfghijklłmnoópqrstuvwxyzźż`\
`1234567890!?.,;:()[]+-="\`\
are supported right now

| `TSGL` custom objects                           |
| ----------------------------------------------- |
| [`class TSGLTexture`](#class-tsgltexture)       |
| [`interface TSGLRegion`](#interface-tsglregion) |

### `class TSGLTexture`

Object representing an image on a sprite batch.\
Created using [`createTexture()`](#async-createtexturesrc--tsgltexture) and used in
[`drawImage()`](#drawimageimg-x-y-options) function to draw the image it represents onto the canvas.

**Fields**

- **`width: number`** - width of the original image
- **`height: number`** - height of the original image

### `interface TSGLRegion`

Interface describing a texture region; part of a texture. Used as a paremeter of [`drawImage()`](#drawimageimg-x-y-options) to determine
which part of the texture you want to draw. Can be used to draw a single frame out of an animation texture or a tileset

**Fields**

- **`x: number`**
- **`y: number`**
- **`width: number`**
- **`height: number`**

## License

[MIT](https://github.com/szymmis/tsgl/blob/main/LICENSE)

## Credits

All credits to
[@szymmis](https://github.com/szymmis)
