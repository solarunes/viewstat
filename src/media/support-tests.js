import { compat_matchMedia as matchMedia } from "../compat";




/**
 * @module media
 */


/**
 * @summary Checks if CSS media queries are supported.
 * @returns {boolean}
 * @example
 * // check if media queries are available
 * console.log(viewstat.media.supportsMediaQueries());
 */
export function supportsMediaQueries() {

	return matchMedia( "only all" ).matches;

}



/**
 * @summary Checks if a specific media query is supported.
 * @param {string} rule Name of the query.
 * @returns {boolean}
 * @example
 * // check if the "resolution" media query is supported
 * console.log(viewstat.media.supportsMediaFeature("resolution"));
 */
export function supportsMediaFeature( rule ) {

	rule = String( rule );

	if ( !supportsMediaQueries() ) return false;
	if ( !rule.match( /\([a-z]+\)/gi ) ) rule = "(" + rule + ")";
	if ( rule.match( /(min|max)-([a-z]+)/ig ) ) rule = rule.replace( /(min|max)-/ig, "" );

	if ( rule === "(color-index)" && matchMedia( "(color-index: 0)" ).matches ) return false;

	return matchMedia( "not all and " + rule + ", " + rule ).matches;

}



/**
 * @summary Determines if a ranged media query rule supports a specified CSS unit.
 * @description This method is not intended to work on any media query, only those that support a min- and max- prefix.
 * @param {string} rule
 * @param {string} unit
 * @returns {boolean}
 * @example
 * // checks if the "resolution" media query supports the "dppx" unit.
 * const supports_resolution_in_dppx = viewstat.media.supportsRangedMediaUnit("resolution", "dppx");
 * console.log(supports_resolution_in_dppx);
 */
export function supportsRangedMediaUnit( rule, unit ) {

	rule = String( rule );
	unit = String( unit );

	if ( rule.match( /min|max/ig ) ) rule = rule.replace( /(min|max)-/ig, "" );

	if ( !supportsMediaFeature( rule ) ) return false;


	if ( rule === "color" || rule === "color-index" ) return unit === "";

	return matchMedia( "(min-" + rule + ": 0" + unit + ")" ).matches;

}
