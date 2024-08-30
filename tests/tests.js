/* eslint no-var:off, no-undef:off */

/*
Rudimentary test suite for real browser testing. Might be difficult to set up in real browsers.
Fully automated cross-browser testing might be implemented in the future, if time and funds are available.
*/



var native_raf = 0;

if ( typeof window.requestAnimationFrame === "function" ) {

	native_raf = requestAnimationFrame;

}

// disable built-ins to make sure that compat detection is working
window.matchMedia = undefined;
window.requestAnimationFrame = undefined;


function write( html ) {

	document.body.innerHTML += html;

}

function isString( prop ) {

	return typeof prop === "string";

}

function isNumber( prop ) {

	return typeof prop === "number";

}

function isBool( prop ) {

	return typeof prop === "boolean";

}

function assert( fn, msg ) {

	var bool = false;

	try {

		bool = fn();

	} catch ( error ) {

		msg += "<br>(Error: " + error + ")";

	}



	if ( bool ) write( "<h6 style='color: green'> [success] " + msg + "</h6>" );
	else write( "<h6 style='color: red'> [failed] " + msg + "</h6>" );

}





// ------ globals



function globalDefined() {

	return window.viewstat && isString( viewstat.VERSION ) && isString( viewstat.AUTHOR ) && isString( viewstat.LICENSE );

}

function compat() {

	var mediaCompat = viewstat.getCompatInfo( "matchMedia" );
	var rafCompat = viewstat.getCompatInfo( "requestAnimationFrame" );

	var empty = viewstat.getCompatInfo( "" );

	if ( mediaCompat.supported && !mediaCompat.name || !mediaCompat.supported && mediaCompat.name ) throw "Compatibility data for matchMedia is incorrect.";
	if ( rafCompat.supported && !rafCompat.name || !rafCompat.supported && rafCompat.name ) throw "Compatibility data for rAF is incorrect.";

	if ( empty !== null ) throw "Expected null, but got " + empty;

	return true;

}

function log() {

	return typeof viewstat.setSilent === "function";

}





// ------ media



function mediaSupported() {

	var has_mq = viewstat.media.supportsMediaQueries();

	if ( has_mq ) return viewstat.media.supportsMediaFeature( "width" ) && viewstat.media.supportsRangedMediaUnit( "width", "px" );

	return true;

}

function mediaTools() {

	var page_width = viewstat.media.getRangedMediaExactValue( "width", "px" );

	viewstat.setSilent( true );

	if ( viewstat.media.getRangedMediaExactValue( "width", "__" ) !== null ) return false;

	viewstat.setSilent( false );

	if ( window.matchMedia ) return matchMedia( "(width: " + page_width + "px)" );

	return viewstat.polyfills.matchMedia( "(width: " + page_width + "px)" );

}




// ------ polyfills

function rafPolyfill() {

	var p = viewstat.polyfills;

	p.startAnimationFrameRuntime();

	var frames = [];

	function _callback( t ) {

		if ( typeof t !== "number" ) return false;

		if ( frames.length < 60 ) {

			frames.push( t );
			p.requestAnimationFrame( _callback );

			return;

		}

		p.stopAnimationFrameRuntime();

		assert( function () {

			return Math.round( ( frames[ 59 ] - frames[ 0 ] ) / 1000 ) === 1;

		}, "requestAnimationFrameRuntime has completed successfully." );

	}

	p.requestAnimationFrame( _callback );

	return true;

}

function mMPolyfill() {

	var mM = viewstat.polyfills.matchMedia;

	return mM( "only all" ).matches && mM( "only all" ).media === "only all" && !mM( "not all" ).matches && mM( "(min-width: 0px)" ).matches;

}



// ------ screen

function screenType() {

	var s = viewstat.screen;

	var colorBitDepth = s.colorBitDepth;
	var colorDepth = s.colorDepth;
	var colorRange = s.colorRange;
	var colorSpace = s.colorSpace;
	var isTerminal = s.isTerminal;

	if ( !isNumber( colorBitDepth ) ) throw "Expected number for colorBitDepth, got " + colorBitDepth;
	if ( !isNumber( colorDepth ) ) throw "Expected number for colorDepth, got " + colorDepth;
	if ( !isNumber( colorRange ) ) throw "Expected number for colorRange, got " + colorRange;
	if ( !isString( colorSpace ) ) throw "Expected string for colorSpace, got " + colorSpace;
	if ( !isBool( isTerminal ) ) throw "Expected boolean for isTerminal, got " + isTerminal;

	return true;

}

function screenDimensions() {

	var s = viewstat.screen.layoutViewport;

	var width = s.width;
	var height = s.height;
	var x = s.offsetX;
	var y = s.offsetY;
	var dpr = s.devicePixelRatio;

	return isNumber( width ) && isNumber( height ) && isNumber( x ) && isNumber( y ) && isNumber( dpr );

}

function screenUpdate() {

	var s = viewstat.screen;

	try {

		window.requestAnimationFrame = native_raf;

		s.getRefreshRateCallback( function ( Hz ) {

			assert( function () {

				return isNumber( Hz ) && Hz !== 0;

			}, "Screen refresh rate has been determined correctly." );

		} );

	} catch ( error ) {

		if ( native_raf !== 0 ) throw "getRefreshRate throwing error although rAF support is there: " + error;

	}

	try {

		window.requestAnimationFrame = native_raf;

		s.analyzeRefreshRateAccuracyCallback( function ( data ) {

			assert( function () {

				return Array.isArray( data );

			}, "Data about screen updates has been collected." );

		} );

	} catch ( error ) {

		if ( native_raf !== 0 ) throw "analyzeRefreshRateAccuracy throwing error although rAF support is there: " + error;

	}

	return true;

}




window.testAll = function () {

	assert( globalDefined, "Global properties are defined." );

	assert( compat, "Compatibility object is behaving correctly." );

	assert( log, "Logging control is working." );

	assert( mediaSupported, "Media support checks are working" );

	assert( mediaTools, "Media utility functions are working." );

	assert( rafPolyfill, "Polyfill for requestAnimationFrame is working." );

	assert( mMPolyfill, "Polyfill for matchMedia is working." );

	assert( screenDimensions, "Screen dimensions are being determined correctly." );

	assert( screenType, "Screen information is being determined correctly." );

	assert( screenUpdate, "Screen refresh information gathering is working." );

}

