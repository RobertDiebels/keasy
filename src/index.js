import Keasy from 'keasy'

/**
 * @see Keasy.down
 * */
export const down = Keasy.down;
/**
 * @see Keasy.up
 * */
export const up = Keasy.up;
/**
 * @see Keasy.press
 * */
export const press = Keasy.press;
/**
 * @see Keasy.minutes
 * */
export const minutes = Keasy.minutes;
/**
 * @see Keasy.seconds
 * */
export const seconds = Keasy.seconds;
/**
 * @see Keasy.milliseconds
 * */
export const milliseconds = Keasy.milliseconds;
/**
 * @param {String} eventType
 * @returns {Keasy}
 * @see {@link Keasy.when}
 */
export function when(eventType) {
    return new Keasy().when(eventType);
}

/**
 * @desc An alias for {@link Keasy.when}( {@link Keasy.down} ).
 * @returns {Keasy}
 * @see {@link Keasy.when}
 * @example <caption>Example 1</caption>
 * Keasy.keydown().on(document.getElementById('fancyId')).then(function(){console.warn("Yea I'm down with it!")});
 */
export function keydown() {
    return new Keasy().when(down);
}

/**
 * @desc An alias for Keasy.when(Keasy.press).
 * @returns {Keasy}
 * @see {@link Keasy.when}
 * @example <caption>Example 1</caption>
 * Keasy.keypress().on(document.getElementById('fancyId')).then(function(){console.warn("Yea you keep pressing those buttons!")});
 */
export function keypress() {
    return new Keasy().when(press);
}

/**
 * @desc An alias for Keasy.when(Keasy.up).
 * @see {@link Keasy.when}
 * @returns {Keasy}
 * @example <caption>Example 1</caption>
 * Keasy.keyup().on(document.getElementById('fancyId')).then(function(){console.warn("Up and running!")});
 */
export function keyup() {
    return new Keasy().when(up);
}