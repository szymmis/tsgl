# TSGL - TypeScript Graphics Library

## Introduction

**TSGL** is a basic wrapper on **WebGL** primitive API,
you don't have to manage low level stuff when using it, as opposed to
using raw WebGL.

With this library you can do basic stuff

- **🚧 TODO 🚧** Easy to use abstract `API` - only a few functions to get the results
- **🚧 TODO 🚧** Rendering simple shapes as `rects` and `circles`
- **🚧 TODO 🚧** Drawing `textures` and `images` onto those shapes
- **🚧 TODO 🚧** `Draw calls batching` for `optimisation` and `simplicity` of use
- **🚧 TODO 🚧** `GUI elements` with basic events such as `onClick`, `onHover`, etc
- **🚧 TODO 🚧** Simple `UI animations` such as `floating`, css like `transitions`, etc
- **🚧 TODO 🚧** Easy to use custom bitmap font `text rendering`

## Installation

**TSGL** has a `CLI` to help you setup your project quickly 

1. Create a directory for your project and get inside it
2. Install **TSGL** using command line `yarn add @szymmis/tsgl` or `npm install @szymmis/tsgl`
3. Setup your project by using **TSGL CLI** `yarn @szymmis/tsgl --init` or `npx @szymmis/tsgl --init`
4. Go through all the steps in the **CLI**
5. Open main file - `src/index.ts`, run `yarn dev` or `npm run dev` to start a **webpack-dev-server** and start coding!
6. You can build your project using `yarn build` or `npm run build`, the output directory `dist` will contain all the files you need to upload on your server

If you like my work, you can show some appreciation by giving this repo a star and sharing it with others!

# Documentation

### Function under `TSGL` object

`drawImage(x: number, y: number, w: number, h: number): void` - function used to draw an image previously loaded into memory

`x` horizontal position of image \
`y` vertical position of image \
`w` width of an image \
`h` height of an image

```js
    import img from "@assets/image.png"

    const TSGL = new TSGL()
    TSGL.loadImage(img)
    TSGL.drawImage(10, 20, 100, 100)
```

## License

This program is distributed under the [GNU General Public License Version 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html).

## Credits
All credits to me 
[@szymmis](https://github.com/szymmis)
