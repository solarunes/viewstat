import { compat_matchMedia as matchMedia } from "../compat";

import { supportsMediaFeature } from "../media/support-tests";
import { mediaQueryBinarySearch, mediaQueryLinearSearch } from "../media/tools";
import { defineGetter } from "../utils";





/**
 * @module screen
 */





/**
 * @summary Returns the number of bits per color.
 * @returns {number}
 */
function colorBitDepth() {

	if ( supportsMediaFeature( "color" ) ) {

		return mediaQueryLinearSearch( "color", "", 8 );

	}

	if ( window.screen && typeof window.screen.colorDepth === "number" ) {

		return screen.colorDepth / 3;

	}

}



/**
 * @summary Returns the number of color bits per pixel.
 * @returns {number}
 */
function colorDepth() {

	if ( window.screen && window.screen.colorDepth ) {

		return screen.colorDepth;

	}

	return colorBitDepth() * 3;

}



/**
 * @summary Returns the size of the browser's color space, i.e. the number of possible colors.
 * @returns {number}
 */
function colorRange() {

	if ( supportsMediaFeature( "color-index" ) && matchMedia( "(min-color-index: 1)" ).matches ) {

		return mediaQueryBinarySearch( "color-index", "", 1, 2 ** 24 );

	}

	return ( 2 ** 3 ) ** colorBitDepth();

}



/**
 * @summary Returns the browser's color gamut/color space.
 * @returns {("sRGB" | "p3" | "rec2020")}
 */
function colorSpace() {

	if ( supportsMediaFeature( "color-gamut" ) ) {

		const col_space_list = [ "sRGB", "p3", "rec2020" ];

		for ( let i = 0; i < col_space_list; i++ ) {

			if ( matchMedia( "(color-gamut: " + col_space_list[ i ] + ")" ).matches ) return col_space_list[ i ];

		}

	}

	return "sRGB";

}





/**
 * @summary Checks if the webpage is running in a terminal browser. Yes, those exist.
 * @returns {boolean}
 */
function isTerminal() {

	if ( !supportsMediaFeature( "grid" ) ) return false;

	return matchMedia( "(grid: 1)" ).matches;

}


/**
 * @internal
 * @private
 */
const screen_inf = {};

defineGetter( screen_inf, "colorBitDepth", colorBitDepth );
defineGetter( screen_inf, "colorDepth", colorDepth );
defineGetter( screen_inf, "colorRange", colorRange );
defineGetter( screen_inf, "colorSpace", colorSpace );
defineGetter( screen_inf, "isTerminal", isTerminal );

export { screen_inf };
