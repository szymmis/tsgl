# TSGL - Simple TypeScript WebGL Library

[![npm](https://img.shields.io/npm/v/@szymmis/tsgl)](https://www.npmjs.org/package/@szymmis/tsgl)
[![downloads-per-week](https://img.shields.io/npm/dt/@szymmis/tsgl?color=red)](https://www.npmjs.org/package/@szymmis/tsgl)
[![license](https://img.shields.io/npm/l/@szymmis/tsgl?color=purple)](https://www.npmjs.org/package/@szymmis/tsgl)

## Introduction

**TSGL** is a basic wrapper on **WebGL** primitive API. \
You don't need to worry about creating shaders and compiling programs etc.\
Simply create a **TSGLInstance** object with `init` function, and use exposed
simple _abstract_ functions such as

- `drawRect()`
- `drawText()`

## Installation and usage

You can use **TSGL** in every possible way.

- as `ESModules` or `CommonJS` importable package with some kind of bundler (ex: `webpack`)
  - **Preferable because of built-in TypeScript typings**

```js
import TSGL from '@szymmis/tsgl'; // ESModules
// or
const TSGL = require('@szymmis/tsgl'); // CommonJS

const canvas = document.querySelector('canvas');
const tsgl = TSGL.init(canvas);
(async function () {
  const img = await tsgl.loadImage('img.png');
  tsgl.setImage(img);
  tsgl.drawRect(50, 50, 100, 100);
})();
```

- in browser by importing the script file and consuming `TSGL` object exposed globally

```html
<body>
  <canvas></canvas>
  <script src="PATH_TO_TSGL.js"></script>
  <script>
    const canvas = document.querySelector('canvas');
    const tsgl = TSGL.init(canvas);
    (async function () {
      const img = await tsgl.loadImage('img.png');
      tsgl.setImage(img);
      tsgl.drawRect(50, 50, 100, 100);
    })();
  </script>
</body>
```

## Documentation

| Available functions inside global `TSGL` object                          |
| ------------------------------------------------------------------------ |
| [init(canvas, options?): TSGLInstance](#initcanvas-options-tsglinstance) |

### `init(canvas, options?): TSGLInstance`

A function used to load an Image from the file. It returns promise that resolves to a simple `HTMLImageElement`. You don't need to use this function, you only need the `HTMLImageElement` to use in the `setImage()` function

**Parameters**

- **`canvas: HTMLCanvasElement`** - canvas on which the graphics will be rendered
- **`options?: TSGLInitialOptions`** - (optional) initial options
  - **`width?: number`** - (optional) width of the screen
  - **`height?: number`** - (optional) height of the screen
  - **`clearColor?: {r: number, g: number, b: number}`** - (optional) specifies the color of the canvas background color after every clear

**Example**

```js
// create TSGLInstance, and set the initial dimensions of the canvas to 800x600
const tsgl = TSGL.init(document.querySelector('canvas'), {
  width: 800,
  height: 600,
});
```

| Available functions inside `TSGLInstance`                                |
| ------------------------------------------------------------------------ |
| [loadImage(src): HTMLImageElement](#async-loadimagesrc-htmlimageelement) |
| [setImage(img): void](#setimageimg-void)                                 |
| [drawRect(x, y, w, h, rotation?): void](#drawrectx-y-w-h-rotation-void)  |
| [drawText(text, x, y): void](#drawtexttext-x-y-void)                     |

### `async loadImage(src): HTMLImageElement`

A function used to load an Image from the file. It returns promise that resolves to a simple `HTMLImageElement`. You don't need to use this function, you only need the `HTMLImageElement` to use in the `setImage()` function

**Parameters**

- **`src: string`** - path to an image file

**Example**

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  // load image from file
  const img = await tsgl.loadImage('my_image.png');
})();
```

### `setImage(img): void`

A function used to set passed `HTMLImageElement` as an active texture ready to be drawn

**Parameters**

- **`img: HTMLImageElement`** - image to be set as an active one

**Example**

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  // load image from file
  const img = await tsgl.loadImage('my_image.png');
  // set image as active to be drawn
  tsgl.setImage(img);
})();
```

### `drawRect(x, y, w, h, rotation?): void`

A function used to draw an image previously loaded into memory with `setImage()`

- **`x: number`** - horizontal position of a rectangle
- **`y: number`** - its vertical position
- **`w: number`** - its width
- **`h: number`** - its height
- **`rotation?: number`** - (optional) rotation of the rect in radians

```js
(async function () {
  // ... initialising tsgl object with TSGL.init()

  // load image from file
  const img = await tsgl.loadImage('my_image.png');
  // set image as active to be drawn
  tsgl.setImage(img);
  /*
   * draw recently loaded image on a rect
   * with size 100x100 on position (50,50)
   */
  tsgl.drawRect(50, 50, 100, 100);
})();
```

### ⚠️ **Note** ⚠️

An image must be set as active by using `setImage` method every time
it needs to be drawn, but do not setImage before every `drawRect` call if
you draw the same img over and over because `setImage` is an expensive operation
when done multiple times in a short period of time

### `drawText(text, x, y): void`

A function used to draw text on a screen using build-in bitmap font

- **`text: string`** - A string to be drawn onto the screen
- **`x: number`** - horizontal position of the text
- **`y: number`** - its vertical position

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

## License

[MIT](https://github.com/szymmis/tsgl/blob/master/LICENSE)

## Credits

All credits to me
[@szymmis](https://github.com/szymmis)
