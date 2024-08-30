import { supportsMediaFeature, supportsRangedMediaUnit } from "./support-tests";
import { isInitialized, compat_matchMedia as matchMedia } from "../compat";

import { roundTo } from "../utils";
import { logger } from "../log";





/**
 * @module media
 */





function _createMatchFn( rule, unit ) {

	return function ( value ) {

		return matchMedia( "(min-" + rule + ": " + value + unit + ")" ).matches;

	};

}





/**
 * @summary Determines the exact value of media queries with integer units by counting up or down from a starting value.
 * @private
 * @internal
 * @param {string} rule
 * @param {string} unit
 * @param {number} startValue
 * @returns {number}
 */
export function mediaQueryLinearSearch( rule, unit, startValue ) {

	const matchValue = _createMatchFn( rule, unit );

	if ( !supportsMediaFeature( rule ) || !matchValue( 0 ) ) {

		logger.error( "This rule does not support the " + unit + " unit" );

		return null;

	}

	if ( matchValue( startValue ) ) {

		while ( matchValue( ++startValue ) );

		return startValue - 1;

	} else {

		while ( matchValue( --startValue ) );

		return startValue + 1;

	}

}





/**
 * @summary Determines the exact value of media queries with floating point units by conducting a binary search from a starting value.
 * @private
 * @internal
 * @param {string} rule
 * @param {string} unit
 * @param {number} precision
 * @param {number} startValue
 * @returns {number}
 */
export function mediaQueryBinarySearch( rule, unit, precision, startValue ) {

	if ( !isInitialized() ) return 0;

	const matchValue = _createMatchFn( rule, unit );

	if ( !supportsRangedMediaUnit( rule, unit ) ) {

		logger.error( "This rule does not support the " + unit + " unit" );

		return null;

	}

	if ( !precision || precision < 0.0001 ) precision = 0.0001;

	let value = startValue || 1;
	let diff = 0;

	if ( matchValue( value ) ) {

		while ( matchValue( value ) ) value *= 2;
		diff = value / 2;

	} else {

		while ( !matchValue( value ) ) value /= 2;
		diff = value;

	}

	do {

		if ( matchValue( value ) ) value += diff;
		else value -= diff;
		diff /= 2;

	} while ( diff / 2 > precision );

	return roundTo( value, 3 );

}





/**
 * @summary Returns the exact value of a ranged CSS media query.
 * @param {string} rule
 * @param {string} unit CSS unit in which the result is determined.
 * @returns {number}
 * @example
 * // determines the exact value of the "width" media query in "vw" units
 * console.log(viewstat.media.getRangedMediaExactValue("width", "vw")); // result should be 100
 */
export function getRangedMediaExactValue( rule, unit ) {

	if ( !supportsRangedMediaUnit( rule, unit ) ) {

		logger.error( "Unit is not supported by this rule: \"" + rule + "\", \"" + unit + "\"" );

		return null;

	}

	if ( rule === "color" ) {

		return mediaQueryLinearSearch( "color", "", 8 );

	}

	if ( rule === "color-index" ) {

		return mediaQueryBinarySearch( rule, "", 0, 2 ** 24 );

	}

	if ( rule.match( /width|height/ig ) ) {

		return mediaQueryBinarySearch( rule, unit || "px", 0, 1000 );

	}

	return mediaQueryBinarySearch( rule, unit, 0, 96 );

}
