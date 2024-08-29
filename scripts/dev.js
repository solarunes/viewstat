import readline from "readline";

import esbuild from "esbuild";
import { umdWrapper } from "esbuild-plugin-umd-wrapper";
import open from "open";

import { defineValues } from "./package.js";

readline.emitKeypressEvents( process.stdin );

if ( process.stdin.isTTY ) process.stdin.setRawMode( true );

async function runDevServer( esbuildContext ) {

	process.stdout.write( "Press any key to dispose...\x1B[?12h" );

	const { host, port } = await esbuildContext.serve( {
		host: "localhost",
		port: 8080,
		servedir: "dev"
	} );

	await esbuildContext.watch();

	open( "http://" + host + ":" + port );

	process.stdin.on( "keypress", () => {

		esbuildContext.dispose();
		process.exit( 0 );

	} );

}

esbuild
	.context( {
		entryPoints: [ "./src/index.js" ],
		bundle: true,
		sourcemap: true,
		format: "umd",
		outfile: "dev/build/viewstat-test.dev.js",
		define: defineValues,
		banner: {
			js: "/*\nviewstat.js --- development version\nDo not use in production!\n*/\n"
		},
		plugins: [ umdWrapper( { libraryName: "viewstat" } ) ]
	} )
	.then( result => {

		runDevServer( result );

	} );
