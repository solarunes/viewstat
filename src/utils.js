function _truncFloat( value, decimals, method ) {

	const factor = 10 ** decimals;

	return method( value * factor ) / factor;

}



/**
 * @summary Rounds a number to a specified number of decimals.
 * @internal
 * @private
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function roundTo( value, decimals ) {

	return _truncFloat( value, decimals, Math.round );

}

/**
 * @summary Truncates a number to a specified number of decimals.
 * @internal
 * @private
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
export function floorTo( value, decimals ) {

	return _truncFloat( value, decimals, Math.floor );

}





/**
 * @summary Defines a getter on an object. Similar to the native __defineGetter__.
 * @internal
 * @private
 * @param {object} obj
 * @param {string} name
 * @param {function} fn
 */
export function defineGetter( obj, name, fn ) {

	if ( window.Object && Object.defineProperty ) {

		Object.defineProperty( obj, name, {

			get: fn,
			enumerable: true

		} );

		return;

	}

	if ( obj.__defineGetter__ ) {

		obj.__defineGetter__( name, fn );

		return;

	}

	obj[ name ] = fn;

}

export function array_from_arguments( _arguments ) {

	const arr = [];

	for ( let i = 0; i < _arguments.length; i++ ) {

		arr[ i ] = _arguments[ i ];

	}

	return arr;

}
