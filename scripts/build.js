// Script for building distribution files.

import fs from "fs";

import esbuild from "esbuild";
import { umdWrapper } from "esbuild-plugin-umd-wrapper";
import * as babel from "@babel/core";

import { pkg, defineValues } from "./package.js";





const BANNER = `/*
--------------------------
viewstat.js - v${pkg.version}

Build date: ${new Date().toUTCString() /* should probably be replaced by a build hash or something */}
Author: ${pkg.author.name} <${pkg.author.email}>
License: ${pkg.license}
--------------------------
*/`;



const common_options = {
	entryPoints: [ "src/index.js" ],
	bundle: true,
	minify: true,
	target: "es6",
	platform: "browser",
	charset: "utf8",
	define: defineValues
};





// Build ESM module. This requires ECMAScript 6 support.

await esbuild.build( {
	...common_options,
	format: "esm",
	banner: {
		js: BANNER
	},
	outfile: "build/viewstat.module.min.js"
} );


// Build legacy UMD script. This is supposed to be broadly ES5-compatible and run in all browsers that support media queries.

const result = await esbuild.build( {

	...common_options,
	format: "umd",
	plugins: [
		umdWrapper( {
			libraryName: "viewstat"
		} )
	],
	write: false // pipe output

} );



// transform to ES5 (see target list)
const es5_source = babel.transformSync(
	new TextDecoder( "utf-8" ).decode( result.outputFiles[ 0 ].contents )
).code;

// Wrap the result in an IIFE.
// This is done to prevent Babel from polluting the global scope with automatically generated polyfills.
const iife_wrapper = `${BANNER}\n(function() {${es5_source}})();`;

fs.writeFileSync( "./build/viewstat.umd.min.cjs", iife_wrapper );

