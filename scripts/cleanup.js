import fs from "fs";
import path from "path";

const $1 = path.dirname( process.argv[ 1 ] );

const build_dir = path.join( $1, "../build" );
const dev_build_dir = path.join( $1, "../dev/build" );
const docs_build_dir = path.join( $1, "../docs" );

const rf = { recursive: true, force: true };

fs.rmSync( build_dir, rf );
fs.rmSync( dev_build_dir, rf );
fs.rmSync( docs_build_dir, rf );


