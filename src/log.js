import { array_from_arguments as array_from } from "./utils";





let SILENT = false;
const label = [ "[viewstat]" ];


// See https://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9



/**
 * @summary Enable/disable console messages. Messages are enabled by default.
 * @param {boolean} bool
 */
export function setSilent( bool ) {

	SILENT = !!bool;

}


function log() {

	if ( typeof console !== "undefined" && console.warn && !SILENT ) {

		const msg_arr = label.concat( array_from( arguments ) );

		// https://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
		Function.prototype.apply.call( console.log, console, msg_arr );

	}

}

function warn() {

	if ( typeof console !== "undefined" && console.warn && !SILENT ) {

		const msg_arr = label.concat( array_from( arguments ) );

		Function.prototype.apply.call( console.warn, console, msg_arr );

	}

}

function error() {

	if ( typeof console !== "undefined" && console.error && !SILENT ) {

		const msg_arr = label.concat( array_from( arguments ) );

		Function.prototype.apply.call( console.error, console, msg_arr );

	}

}

/**
 * @private
 * @internal
 */
export const logger = {
	log,
	warn,
	error
};
