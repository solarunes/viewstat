/* eslint-disable */



/**
 * @global
 */

/**
 * @type {string}
 * @readonly
 */
export const VERSION = __VERSION__;
/**
 * @type {string}
 * @readonly
 */
export const AUTHOR = __AUTHOR__;
/**
 * @type {string}
 * @readonly
 */
export const LICENSE = __LICENSE__;

export { getCompatInfo } from "./compat";
export { setSilent } from "./log";

export * as polyfills from "./polyfills";
export * as media from "./media";
export { screen } from "./screen";
