/*
-------------------------
  requestAnimationFrame
-------------------------
*/

/*
This polyfill is not used by viewstat.js because it does not provide the same functionality
as the native requestAnimationFrame. It executes the callback at a frequency of 60 Hz and does not
adapt to the screen refresh rate.

To improve performance, the animation loop has to be started manually.
*/


/**
 * @module polyfills/requestAnimationFrame
 */



import { isInitialized } from "../compat";
import { logger } from "../log";



let frame_registry = [];
let fID = 0;

let timestamp = 0;
let intervalID = 0;

const timeOrigin = new Date().getTime();



/**
 * @summary Polyfill for requestAnimationFrame. Runs at frequency of 60 Hertz.
 * @param {function} callback
 * @returns {number}
 * @example
 * const callback = (t) => console.log(t); // timestamp
 * viewstat.polyfills.requestAnimationFrame(callback);
 * viewstat.polyfills.startAnimationFrameRuntime(); // call this to initialize the animation loop
 */
export function requestAnimationFrame( callback ) {

	if ( !animationFrameIsRunning() ) logger.warn( "Runtime is offline." );

	frame_registry[ fID ] = callback;

	return fID++;

}



/**
 * @summary Polyfill for cancelAnimationFrame.
 * @param {number} requestID
 */
export function cancelAnimationFrame( requestID ) {

	if ( frame_registry.indexOf( requestID ) === - 1 ) return;

	frame_registry.splice( requestID, 1 );

}





// runtime loop
function _runRequests() {

	const functions = [ ...frame_registry ];

	frame_registry = [];
	fID = 0;

	for ( let i = 0; i < functions.length; i++ ) {

		functions[ i ]( timestamp );

	}

	timestamp = new Date().getTime() - timeOrigin;

}



/**
 * @summary Starts the animation loop.
 * @description The polyfill for requestAnimationFrame will not work without having started the runtime.
 */
export function startAnimationFrameRuntime() {

	if ( intervalID || !isInitialized() ) return;

	intervalID = setInterval( _runRequests, 1000 / 60 );

}



/**
 * @summary Stops the animation loop.
 */
export function stopAnimationFrameRuntime() {

	if ( !intervalID ) return;

	clearInterval( intervalID );
	intervalID = 0;

	frame_registry = [];
	fID = 0;

}



/**
 * @summary Returns true if the animation loop for {@link requestAnimationFrame} requests is currently running, false if not.
 * @returns {boolean}
 */
export function animationFrameIsRunning() {

	return Boolean( intervalID );

}
