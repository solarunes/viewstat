import { supportsMediaFeature } from "../media/support-tests";
import { mediaQueryBinarySearch } from "../media/tools";

import { roundTo, defineGetter } from "../utils";




/**
 * @module screen/layoutViewport
 */




/**
 * @summary Returns the width of the *layout viewport* in CSS pixels. Depends on page- and system zoom.
 * @returns {number}
 */
function width() {

	if ( supportsMediaFeature( "width" ) ) {

		return roundTo(
			mediaQueryBinarySearch( "width", "px", 0, 1920 ),
			0
		);

	}

	return roundTo( document.documentElement.clientWidth, 0 );

}

/**
 * @summary Returns the height of the *layout viewport* in CSS pixels. Depends on page- and system zoom.
 * @returns {number}
 */
function height() {

	if ( supportsMediaFeature( "height" ) ) {

		return roundTo(
			mediaQueryBinarySearch( "height", "px", 0, 1080 ),
			0
		);

	}

	return roundTo( document.documentElement.clientHeight, 0 );

}

/**
 * @summary Returns the horizontal offset of the layout viewport from the document.
 * @returns {number}
 */
function offsetX() {

	return window.scrollX || window.pageXOffset;

}

/**
 * @summary Returns the vertical offset of the layout viewport from the document.
 * @returns {number}
 */
function offsetY() {

	return window.scrollY || window.pageYOffset;

}





/**
 * @summary Returns the ratio of device pixels to CSS pixels.
 * @returns {number}
 */
function devicePixelRatio() {

	let windowDevicePixelRatio = 0;

	if (
		!window.devicePixelRatio &&
		window.screen &&
		window.screen.screenXDPI &&
		window.screen.logicalXDPI
	) {

		windowDevicePixelRatio = Math.round( screen.screenXDPI / screen.logicalXDPI * 1000 ) / 1000;

	} else {

		windowDevicePixelRatio = window.devicePixelRatio;

	}

	let resolution_query_name = "";

	if ( !supportsMediaFeature( "resolution" ) ) {

		const prefixed = [ "-o-", "-moz-", "-webkit-" ];

		for ( let i = 0; i < prefixed.length; i++ ) {

			const alias = prefixed[ i ] + "device-pixel-ratio";

			if ( supportsMediaFeature( alias ) ) resolution_query_name = alias;

		}

	} else {

		resolution_query_name = "resolution";

	}

	let cssdpi = 0;

	if ( !resolution_query_name ) {

		cssdpi = windowDevicePixelRatio;

	} else {

		cssdpi = roundTo( mediaQueryBinarySearch( resolution_query_name, "dpi", 0, 96 ), 3 );

	}

	if ( roundTo( windowDevicePixelRatio, 3 ) === cssdpi ) {

		return windowDevicePixelRatio;

	}

	return cssdpi / 96;

}





/**
 * @summary Holds information about the webpage's layout viewport.
 * @readonly
 * @memberof screen
 */
const layoutViewport = {};

defineGetter( layoutViewport, "width", width );
defineGetter( layoutViewport, "height", height );
defineGetter( layoutViewport, "offsetX", offsetX );
defineGetter( layoutViewport, "offsetY", offsetY );
defineGetter( layoutViewport, "devicePixelRatio", devicePixelRatio );

export { layoutViewport };
