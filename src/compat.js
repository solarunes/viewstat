import { matchMedia as matchMediaPolyfill } from "./polyfills/matchMedia";

import { logger } from "./log";
import { array_from_arguments } from "./utils";





// Cache object to store compatibility data.
const compatinfo = {};





// Determines if the library still needs to be initialized.
let INIT = false;



function _isBrowser() {

	return typeof window !== "undefined" && window.document;

}



/**
 * Returns true if the library has been initialized and is ready to use.
 * @returns {boolean}
 */
export function isInitialized() {

	return INIT;

}



/**
 * Tries to initialize the library. Will be done automatically in a browser environment.
 * This can be useful if you're processing JavaScript on the server side.
 */
export function init() {

	if ( !_isBrowser() ) {

		logger.error( "Cannot initialize in a non-browser environment." );

		return;

	}

	if ( !INIT ) {

		INIT = true;

		// load compatibility data
		getRequestAnimationFrame();
		getMatchMedia();

		return;

	}

	logger.warn( "Library has already been initialized." );

}



if ( _isBrowser() ) {

	init();

}






/**
 * @interface CompatibilitySpecifier
 * @property {string} name The name of the built-in. Includes prefixes and polyfills.
 * @property {boolean} supported True if the feature is supported by the browser, false if not.
 */
/* eslint-disable-next-line */
const CompatibilitySpecifier = {}; // dummy to prevent typescript from throwing an error

/**
 * @summary Get details on the compatibility of various JavaScript built-ins.
 * @description Although this library does provide a polyfill for requestAnimationFrame, getCompatInfo will not show it. The reason for this is that the polyfill does not adapt to the screen's refresh rate.
 * @param {string} name The name of the built-in without prefixes or polyfills.
 * @returns {CompatibilitySpecifier}
 * @example
 * // requestAnimationFrame is available
 * const { supported, name } = viewstat.getCompatInfo("requestAnimationFrame");
 * console.log( supported ) // true
 * console.log( name ) // "requestAnimationFrame"
 * @example
 * // requestAnimationFrame is available with a prefix
 * const { supported, name } = viewstat.getCompatInfo("requestAnimationFrame");
 * console.log( supported ) // true
 * console.log( name ) // "webkitRequestAnimationFrame"
 * @example
 * // matchMedia is available as a polyfill
 * const { supported, name } = viewstat.getCompatInfo("matchMedia");
 * console.log( supported ) // true
 * console.log( name ) // "viewstat.polyfills.matchMedia"
 * @example
 * // matchMedia is not available because media queries are not supported at all
 * const { supported, name } = viewstat.getCompatInfo("matchMedia");
 * console.log( supported ) // false
 * console.log( name ) // ""
 */
export function getCompatInfo( name ) {

	const data = compatinfo[ name ];

	if ( !data ) {

		logger.warn( "No compatibility data found for this entry" );

		return null;

	}

	return {
		supported: compatinfo[ name ].supported,
		name: compatinfo[ name ].name
	};

}

/**
 * Set details on the compatibility of related JavaScript internals. For internal use only.
 * @internal
 * @private
 * @param {string} entry
 * @param {boolean} supported
 * @param {string} name
 */
export function setCompatInfo( entry, supported, name ) {

	compatinfo[ entry ] = {
		supported,
		name
	}

}





// Template for throwing a type error if a feature is lacking browser support.
function _throwUnsupported( name ) {

	logger.error( "\"" + name + "\" is not supported on this device." );

}






/**
 * Tries to fetch the "requestAnimationFrame" function and writes results to the compatibility table.
 * @internal
 * @private
 * @returns {function} Either requestAnimationFrame or a placeholder function that will throw an error if the former is not supported.
 */
function getRequestAnimationFrame() {

	if ( window.requestAnimationFrame ) {

		setCompatInfo( "requestAnimationFrame", true, "requestAnimationFrame" );

		return requestAnimationFrame;

	}

	const variants = [ "webkitRequestAnimationFrame", "mozRequestAnimationFrame" ];

	for ( let i = 0; i < variants.length; i++ ) {

		if ( window[ variants[ i ] ] ) {

			setCompatInfo( "requestAnimationFrame", true, variants[ i ] );

			return window[ variants[ i ] ];

		}

	}

	setCompatInfo( "requestAnimationFrame", false, "" );

	_getCancelAnimationFrame();

	return function () {

		_throwUnsupported( "requestAnimationFrame" );

	};

}



/**
 * Supplementary to {@link getRequestAnimationFrame}.
 * @internal
 * @private
 * @returns {boolean}
 */
function _getCancelAnimationFrame() {

	if ( window.cancelAnimationFrame ) {

		setCompatInfo( "cancelAnimationFrame", true, "cancelAnimationFrame" );

		return;

	}

	const variants = [ "webkitCancelAnimationFrame", "mozCancelAnimationFrame" ];

	for ( let i = 0; i < variants.length; i++ ) {

		if ( window[ variants[ i ] ] ) {

			setCompatInfo( "cancelAnimationFrame", true, variants[ i ] );

			return;

		}

	}

	setCompatInfo( "cancelAnimationFrame", false, "" );

}






/**
 * Tries to fetch the "matchMedia" function and provides a polyfill if media queries are supported but "matchMedia" is not.
 * @internal
 * @private
 * @returns {function} Either the native matchMedia function, a polyfill or a placeholder function that will throw an error if media queries are not available in general.
 */
function getMatchMedia() {

	if ( window.matchMedia ) {

		setCompatInfo( "matchMedia", true, "matchMedia" );

		return matchMedia;

	}

	if ( matchMediaPolyfill( "only all" ).matches ) {

		setCompatInfo( "matchMedia", true, "viewstat.polyfills.matchMedia" );

		return matchMediaPolyfill;

	}

	setCompatInfo( "matchMedia", false, "" );

	return function () {

		_throwUnsupported( "matchMedia" );

	};

}




export const compat_requestAnimationFrame = function _compat_requestAnimationFrame() {

	if ( INIT ) return getRequestAnimationFrame().apply( this, array_from_arguments( arguments ) );

	throw new SyntaxError( "[viewstat] Library still needs to be initialized." );

};

export const compat_matchMedia = function _compat_matchMedia() {

	if ( INIT ) return getMatchMedia().apply( this, array_from_arguments( arguments ) );

	throw new SyntaxError( "[viewstat] Library still needs to be initialized." );

};
