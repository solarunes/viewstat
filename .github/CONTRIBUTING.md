# Contributing Tips and Guidelines

When contribute to this project, please make sure that all changes to the code base are supported by the targeted browsers. Syntax will automatically be transpiled, built in features **will not**.

## Build
Create a quick build without type declarations because TSC is egregiously slow. Run without the prefix to create a full build.
```sh
npm run build:notypes
```

## Linting & Testing
All code in this repository has to be formatted according to a set of [ESLint rules](https://github.com/solarunes/eslint-config-solarunes).
To apply code formatting:
```sh
npm run lint:fix
```

Run tests in the browser (subject to improvement):
```sh
npm test
```

### Testing in legacy browsers
Recommended strategy:
1. Copy the UMD bundle from the build folder into the <code>test.html</code> file.
2. Create a temporary domain for the webpage, using for example TiinyHost or GitHub Pages.
3. Set up a virtual machine containing the legacy operating system and browser.
4. Open the webpage in the virtual machine, check for error messages and unexpected behavior.

## Create Docs
Build and serve documentation directly from source:
```sh
npm run docs:build
npm run docs:serve
```
