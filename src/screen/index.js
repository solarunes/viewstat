// Merge the modules manually to preserve the getter/setter structure.

import { layoutViewport } from "./dimensions";
import { screen_inf } from "./type";
import * as util_methods from "./update";


/**
 * @summary Holds information about the physical screen the webpage is rendered on.
 * @type {object}
 * @readonly
 */
const screen = {};

const screen_inf_keys = Object.keys( screen_inf );
const util_methods_keys = Object.keys( util_methods );

for ( let i = 0; i < screen_inf_keys.length; i++ ) {

	screen[ screen_inf_keys[ i ] ] = screen_inf[ screen_inf_keys[ i ] ];

}

for ( let i = 0; i < util_methods_keys.length; i++ ) {

	screen[ util_methods_keys[ i ] ] = util_methods[ util_methods_keys[ i ] ];

}

screen.layoutViewport = layoutViewport;


export { screen };
