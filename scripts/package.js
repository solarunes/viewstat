import fs from "fs";
import path from "path";

export const rootPath = path.join( path.dirname( process.argv[ 1 ] ), ".." );

const json = fs.readFileSync( path.join( rootPath, "package.json" ), "utf-8" );

export const pkg = JSON.parse( json );

export const defineValues = {
	__VERSION__: `"${pkg.version}"`,
	__AUTHOR__: `"${pkg.author.name} (${pkg.author.email})"`,
	__LICENSE__: `"${pkg.license}"`
};
