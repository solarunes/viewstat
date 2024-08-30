/*
------------------------
       matchMedia
------------------------
*/

/*
This implementation does not currently support events.
*/


/**
 * @module polyfills/matchMedia
 */





import { logger } from "../log";
import { defineGetter } from "../utils";
import { isInitialized } from "../compat";





// Hash to prevent outside use of the MediaQueryListPolyfill constructor.
// This is purely to mirror the behavior of the native MediaQueryList.
const _key = new Date().getTime() / ( new Date().getTime() % 100 - 50 );

const _mediaTestTopShiftPX = 5;

// Set of functions to test media queries on a live DOM node.

//------------------------

function _generateMediaQuery( query ) {

	return (
		"@media " +
		query +
		" { #__mediapolyfill_dummy__ { top: " +
		_mediaTestTopShiftPX +
		"px !important; } }"
	);

}

function _createMediaTestNode( query ) {

	const root = document.createElement( "div" );

	root.style = "visibility: hidden; position: absolute; top: 0px;";
	root.setAttribute( "id", "__mediapolyfill_dummy__" );

	const stylesheet = document.createElement( "style" );
	const css = document.createTextNode( _generateMediaQuery( query ) );

	stylesheet.appendChild( css );

	return { root, stylesheet };

}

function _addMediaTestNode( node ) {

	document.body.appendChild( node.root );
	document.head.appendChild( node.stylesheet );

}

function _removeMediaTestNode( node ) {

	document.body.removeChild( node.root );
	document.head.removeChild( node.stylesheet );

}

// function _updateMediaTestNodeQuery( node, query ) {

// 	node.stylesheet.innerHTML = _generateMediaQuery( query );

// }

function _mediaTestNodeHasChanged( node ) {

	return node.root.offsetTop === _mediaTestTopShiftPX;

}

//------------------------



/**
 * @summary Polyfill of the "MediaQueryList" object. Does not currently support events.
 * @interface MediaQueryListPolyfill
 * @property {string} media Media query string.
 * @property {boolean} matches Set to *true* if media query matches the document, *false* if otherwise.
 * @property {Function} onchange Event handler that fires if the media query changes status. **Currently does nothing.**
 * @todo Add event interface.
 */
export function MediaQueryListPolyfill() {

	if ( !isInitialized() ) return null;

	if ( arguments[ 0 ] !== _key ) throw new TypeError( "[viewstat] Illegal constructor" );

	const _media = arguments[ 1 ];
	const _matches = arguments[ 2 ];

	this.media = _media;
	this.matches = _matches;
	defineGetter( this, "onchange", function () {

		logger.warn( "This polyfill does not currently support events" );

	} );

}



/**
 * @summary Polyfill for the "matchMedia" built-in. Does not currently support events.
 * @param {string} rule media query to match
 * @returns {MediaQueryListPolyfill}
 * @example
 * const {media, matches} = viewstat.polyfills.matchMedia("(min-height: 500px)");
 * console.log( media ) // "(min-height: 500px)"
 * console.log( matches ) // true or false
 */
function matchMedia( rule ) {

	if ( !isInitialized() ) return null;

	// IE9
	if ( window.media || window.styleMedia ) {

		const media_alias = window.media || window.styleMedia;

		rule = rule || "only all";

		return {
			matches: media_alias.matchMedium( rule ),
			media: rule
		}

	}

	const node = _createMediaTestNode( rule );

	_addMediaTestNode( node );

	if ( _mediaTestNodeHasChanged( node ) ) {

		_removeMediaTestNode( node );

		return new MediaQueryListPolyfill( _key, rule, true );

	}

	_removeMediaTestNode( node );

	return new MediaQueryListPolyfill( _key, rule, false );

}





export { matchMedia };
