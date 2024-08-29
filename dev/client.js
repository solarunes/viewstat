// live reload


try {

	const srcdir = new EventSource( "/esbuild" );

	srcdir.addEventListener( "change", () => location.reload() );

} catch ( error ) {

	console.info( "[live reload]", error );

}

window.matchMedia = undefined;
window.requestAnimationFrame = undefined;
