<center>

<h1>viewstat.js</h1>
<h3>Viewport Information &#8212; CSS Media Query Tools &#8212; Polyfills</h3>

</center>

*viewstat* is a frontend-only JavaScript library that provides various tools to interact with CSS media queries and the viewport.
It's features include:

- Polyfills for <code>matchMedia</code> and <code>requestAnimationFrame</code>.
- Screen/Viewport information, such as reliable <code>width</code>, <code>height</code> and <code>devicePixelRatio</code> detection as well as screen parameters like refresh rate and color depth.
- Media query tools to check support for individual rules, units and to determine the current values of media queries such as <code>width</code> and <code>resolution</code>.

### Support

- Chome 10+ (tested)
- Edge 12+
- Firefox 3.5+ (tested)
- Opera 10+
- IE 9+ (tested)

### Installation

Install the package using npm or yarn:

```sh
npm i viewstat@latest
```

```sh
yarn add viewstat@latest
```

To import from JavaScript:
```js
// import the package as a bundle
import * as viewstat from "viewstat";

console.log(viewstat.VERSION);
```

Types and UMD exports are also available.

Although not recommended, the library can also be loaded directly into a web page via a CDN link:

```html
<script type="text/javascript" src="https://unpkg.com/viewstat@latest/build/viewstat.umd.min.cjs" defer></script>
```
**Note that this library must be loaded after the body element.**

# Examples

Get the current screen's refresh rate:
```js
import { screen } from "viewstat";

const refreshRate = await screen.getRefreshRate();
```

Test support for the <code>dppx</code> unit in <code>resolution</code> media queries:
```js
import { media } from "viewstat";

const supportsResolutionWithDPPX = media.supportsRangedMediaUnit("resolution", "dppx");
```

Check compatibility of <code>requestAnimationFrame</code>
```js
import { getCompatInfo } from "viewstat";

const { name, supported } = getCompatInfo("requestAnimationFrame");
// e.g.
// supported: true
// name: "webkitRequestAnimationFrame"
```


# Documentation

Documentation is available [here](https://solarunes.github.io/projects/viewstat).
Alternatively, it can be built directly from source.



# Development & Contributing

Contributing to this project is strongly encouraged as I currently have little time to continue active development.

## Setup
Development on this project requires Git and npm.
Download the repository and install the dependencies:
```sh
git clone https://github.com/solarunes/viewstat.js viewstat
cd viewstat
npm install
```

## Development Server
Run a local development server. This will provide a local build in the <code>dev</code> directoy. HMR and live reload are supported by default.
```sh
npm run dev
```

## Further reading
More information and contributing guidelines are available on [GitHub](https://github.com/solarunes/viewstat)
