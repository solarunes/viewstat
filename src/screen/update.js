import { compat_requestAnimationFrame as requestAnimationFrame } from "../compat";
import { logger } from "../log";





/**
 * @module screen
 */





/**
 * @typedef RefreshRateCallback
 * @type {function}
 * @param {number} refreshRate
 */


/**
 * @summary Determines the current monitor's refresh rate (in Hertz).
 * @param {number} datapoints
 * @returns {Promise<number>|null}
 * @example
 * // get the refresh rate of the current screen in Hertz
 * viewstat.screen.getRefreshRate().then((result) => {
 *     console.log(result);
 * });
 */
export function getRefreshRate( datapoints = 10 ) {

	if ( !( window.Promise && typeof Promise === "function" && Promise.prototype ) ) {

		logger.warn(

			"Promises are not supported on this device. Try using 'getRefreshRateCallback' instead."
		);

		return null;

	}

	return new Promise( ( resolve, reject ) => {

		function _callback( Hz ) {

			resolve( Hz );

		}

		try {

			getRefreshRateCallback( _callback, datapoints );

		} catch ( error ) {

			reject( error );

		}

	} );

}



/**
 * @summary ES5-compatible version of {@link getRefreshRate} that uses a callback function instead of an ES6 Promise.
 * @param {RefreshRateCallback} callback Function to call the result to.
 * @param {number} datapoints Number of time stamps to be taken. A larger number increases accuracy.
 * @returns {void}
 * @example
 * const callback = (result) => console.log(result);
 * viewstat.screen.getRefreshRateCallback(callback);
 */
export function getRefreshRateCallback( callback, datapoints = 10 ) {

	let t0 = 0;
	let accum = 0;
	let i = 0;

	requestAnimationFrame( function __tick( t1 ) {

		if ( i > 1 ) accum += t1 - t0;
		t0 = t1;

		if ( i++ > datapoints ) callback( Math.round( 1000 * datapoints / accum ) );
		else requestAnimationFrame( __tick );

	} );

}






/*
------------------------
	DEBUGGING TOOLS
------------------------
*/



/**
 * @summary Analyzes the accuracy of {@link getRefreshRate}
 * @param {number} realRefreshRate Real refresh rate of the current monitor.
 * @param {number} datapoints Number of time stamps to be taken for a single test run. A larger number increases accuracy.
 * @param {number} sampleSize Number of test runs.
 * @returns {{response: Promise<number[]>, exec_time: Date}} Returns a promise and an execution time estimate.
 * @example
 * viewstat.screen.analyzeRefreshRateAccuracy(60, 7, 100).then((data) => {
 *     console.log(data);
 * }
 */
export function analyzeRefreshRateAccuracy( realRefreshRate, datapoints, sampleSize ) {

	if ( !( window.Promise && typeof Promise === "function" && Promise.prototype ) ) {

		logger.warn(

			"Promises are not supported on this device. Try using 'analyzeRefreshRateAccuracyCallback' instead."
		);

		return null;

	}

	let proctime = 0;

	const response = new Promise( ( resolve, reject ) => {

		function _callback( data ) {

			resolve( data );

		}

		try {

			proctime = analyzeRefreshRateAccuracyCallback( _callback, realRefreshRate, datapoints, sampleSize );

		} catch ( error ) {

			reject( error );

		}

	} );

	return {
		response,
		exec_time: proctime
	};

}



/**
 * @summary ES5-compatible version of {@link analyzeRefreshRateAccuracy} that uses a callback function instead of an ES6 Promise.
 * @param {RefreshRateCallback} callback Function to call the result to.
 * @param {number} realRefreshRate Real refresh rate of the current monitor.
 * @param {number} datapoints Number of time stamps to be taken for a single test run. A larger number increases accuracy.
 * @param {number} sampleSize Number of test runs.
 * @returns {Date} Estimated execution time.
 * @example
 * const logData = (data) => console.log(data);
 * viewstat.screen.analyzeRefreshRateAccuracyCallback(callback, 60, 7, 100);
 */
export function analyzeRefreshRateAccuracyCallback(
	callback,
	realRefreshRate,
	datapoints,
	sampleSize = 100
) {

	const arr = new Array( 1000 );

	for ( let j = 0; j < arr.length; j++ ) arr[ j ] = 0;

	let i = 0;

	const proctime = new Date( Math.round( ( datapoints + 2 ) * sampleSize / realRefreshRate ) * 1000 );

	let m = proctime.getMinutes();

	if ( m > 0 ) m += "m";
	else m = "";

	logger.log(
		`Estimated processing time: ${ m } ${ proctime.getSeconds() }s`
	);

	getRefreshRate( function __test( t ) {

		arr[ t ]++;

		if ( ++i < sampleSize ) {

			getRefreshRateCallback( __test, datapoints );

			return;

		}

		callback( arr );

	}, datapoints );

	return proctime;

}
