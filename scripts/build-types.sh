#!/bin/sh

# TODO: Implement this script in Node.js for cross-platform compatibility.

npx tsc

npx dts-bundle-generator -o build/viewstat.d.ts src/index.d.ts

rm $(find src -iname "*.d.ts")
