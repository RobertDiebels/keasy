import _isString from 'lodash/isString';
import _isInteger from 'lodash/isInteger';
import _isFunction from 'lodash/isFunction';
import _debounce from 'lodash/debounce';
import _keys from 'lodash/keys'
import KeyDown from './events/keydown';
import KeyPress from './events/keypress';
import KeyUp from './events/keyup';
import EventListener from './eventlistener';
import KeyMatcher from './keymatcher';

const keasyEventSpace = "keasy:";
/**
 * @type {string}
 */
export const down = keasyEventSpace + "keydown";
/**
 * @type {string}
 */
export const up = keasyEventSpace + "keyup";
/**
 * @type {string}
 */
export const press = keasyEventSpace + "keypress";
const eventMap = {
    'keydown': KeyDown,
    'keypress': KeyPress,
    'keyup': KeyUp
};

/**
 * @type {string}
 */
export const milliseconds = 'milliseconds';
/**
 * @type {string}
 */
export const seconds = 'seconds';
/**
 * @type {string}
 */
export const minutes = 'minutes';

export default class Keasy {

    /**
     * @external {KeyBoardEvent} https://developer.mozilla.org/en-US/docs/Web/API/KeyBoardEvent
     */
    /**
     * @external {EventTarget} https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
     */

    /**
     * @desc Sets the eventType {@link String} this {@link Keasy} instance will capture.
     * @param {String} [eventType] - This parameter is optional. If Keasy.when(eventType) is not passed an eventType it defaults to 'keydown'. Passing an eventType is advisable for readability purposes.
     * @returns {Keasy}
     * @example <caption>Example 1 (Using Keasy shorthand)</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn("Keasy-peasy!")});
     * @example <caption>Example 2 (Using string)</caption>
     * Keasy.when('keydown').on(document.getElementById('fancyId')).then(function(){console.warn("Keasy-peasy!")});
     */
    when(eventType) {
        if (_isString(eventType)) {
            this._event = this._generateKeyEventObject(Keasy._removeKeasyEventSpace(eventType));
        }
        else {
            this._event = new KeyDown();
        }
        return this;
    }

    /**
     * @desc Binds an {@link EventTarget} to this {@link Keasy} instance.
     * @param {EventTarget} eventTarget - The targeted {@link EventTarget} Keasy should target for {@link KeyBoardEvent}.
     * @throws {TypeError} If {@link Keasy.on} is not passed a valid {@link EventTarget} it will throw a {@link TypeError}.
     * @returns {Keasy}
     * @example <caption>Example 1 (Using DOM)</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn("Keasy-peasy!")});
     * @example <caption>Example 2 (Using jQuery)</caption>
     * Keasy.when(Keasy.down).on($('#fancyId')[0]).then(function(){console.warn("Keasy-peasy!")});
     */
    on(eventTarget) {
        const DOMELEMENT_TYPE_ERROR = "Keasy.on(eventTarget) expects 'eventTarget' to be a valid EventTarget. It isn't.";
        if (eventTarget instanceof EventTarget) {
            this._eventTarget = eventTarget;
        }
        else {
            throw new TypeError(DOMELEMENT_TYPE_ERROR);
        }
        return this;
    }

    /**
     * @desc Binds a callback {@link Function} to this Keasy intsance.
     * Not calling {@link Keasy.then} means Keasy produces no output. Keasy still catches events of the type passed to {@link Keasy.when}.
     * Meaning you can call {@link Keasy.then} at another point in your code. See Example 3 for details.
     * @param {Function} callback - The Function Keasy will call after it has caught a {@link KeyBoardEvent}.
     * @throws {TypeError} If Keasy.then(callback) is not passed a {@link Function} a {@link TypeError} is thrown.
     * @returns {Keasy}
     * @example <caption>Example 1</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn('Thank you!!')});
     * @example <caption>Example 2</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){document.getElementById('pretty').innterText = "Thank you!!"});
     * @example <caption>Example 3</caption>
     * var keasy = Keasy.when(Keasy.down).on(document.getElementById('fancyId'));
     * document.getElementById('pretty').innerText = "Waiting is so boring..";
     * function delayedThen(){
     *      document.getElementById('pretty').innerText = "Ok I'm fed up with waiting.. For the love of God please type something!";
     *      keasy.then(function(){
     *          document.getElementById('pretty').innerText = "Thank you!!";
     *      });
     * };
     * window.setTimeout(delayedThen, 5000);
     */
    then(callback) {
        const CALLBACK_TYPE_ERROR = "Keasy.then(callback) expects 'callback' to be a Function. It isn't.";
        if (_isFunction(callback)) {
            this._callback = callback;
            this.off();
            this._subscribeToEvent();
        }
        else {
            throw new TypeError(CALLBACK_TYPE_ERROR);
        }
        return this;
    }

    /**
     * @desc Sets the amount of time and the unit of time this {@link Keasy} instance should wait until triggering the callback set in {@link Keasy.then}
     * @param {Number} amount - The amount of time Keasy waits until the {@link EventTarget} passed to {@link Keasy.on} stops firing {@link KeyBoardEvent}s.
     * @param {String} [unit] - This parameter is optional. If  Keasy.after(amount,unit) is not passed a unit it defaults to milliseconds.
     * @throws {TypeError}
     * @returns {Keasy}
     * @example <caption>Example 1</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn('Thank you!!')}).after(600);
     * @example <caption>Example 2</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn('Thank you!!')}).after(60000, Keasy.milliseconds);
     * @example <caption>Example 3</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn('Thank you!!')}).after(60, Keasy.seconds);
     * @example <caption>Example 4</caption>
     * Keasy.when(Keasy.down).on(document.getElementById('fancyId')).then(function(){console.warn('Thank you!!')}).after(1, Keasy.minutes);
     */
    after(amount, unit) {
        const AMOUNT_TYPE_ERROR = "Keasy.after(amount,unit) expects 'amount' to be an Integer. It isn't.";
        if (_isInteger(amount)) {
            this._delay = Keasy._toMilliseconds(amount, unit || milliseconds);
            this.off();
            this._subscribeToEvent();
        }
        else {
            throw new TypeError(AMOUNT_TYPE_ERROR);
        }
        return this;
    }

    /**
     * @desc Removes the current listener from the {@link EventTarget} passed to {@link Keasy.on}.
     */
    off() {
        if (this._eventListener) {
            this._eventListener.removeFrom(this._eventTarget);
        }
    }

    /**
     * @desc Binds a {@link String} representing a set of keys to this {@link Keasy} instance limiting when the callback {@link Function} passed to {@link Keasy.then} gets called.
     * The keys in the {String} that is passed should be divided by a "+" character.
     * @param {String} keyString
     * @throws {TypeError} If {@link Keasy.is} is not passed a {String} a {@link TypeError} is thrown.
     * @returns {Keasy}
     * @example <caption>Example 1</caption>
     * Keasy.when(Keasy.eventType).on(target).is(Keasy.ctrl+"+k").then(function(){console.warn("Event was CTRL+K")})
     */
    is(keyString) {
        const KEYSTRING_TYPE_ERROR = "Keasy.is(keyString) expects 'keyString' to be a String. It isn't.";
        if (_isString(keyString)) {
            this._keyStringToMatch = keyString;
            this.off();
            this._subscribeToEvent();
        }
        else {
            throw new TypeError(KEYSTRING_TYPE_ERROR);
        }
        return this;
    }

    _generateKeyEventObject(eventName) {
        let event = null;
        _keys(eventMap).forEach((key) => {
            const keyEvent = new eventMap[key]();
            if (keyEvent.equals(eventName)) {
                event = keyEvent;
            }
        });
        return event;
    }

    _subscribeToEvent() {
        this._eventListener = new EventListener(this._event, this._generateExecutor());
        this._eventListener.addTo(this._eventTarget);
    }

    _generateExecutor() {

        return (this._hasDelay()) ? this._generateDebouncedListener() : this._genereateRegularListener();
    }

    _generateDebouncedListener() {
        const self = this;
        const debouncedListener = _debounce(function () {
            self._callback();
        }, self._delay);


        const keyMatchingDebouncedListener = _debounce(function (event) {
            if (self._keyStringToMatch && new KeyMatcher().match(self._keyStringToMatch).withEvent(event)) {
                self._callback();
            }
        }, self._delay);

        return (this._keyStringToMatch) ? keyMatchingDebouncedListener : debouncedListener;
    }

    _genereateRegularListener() {
        const self = this;

        const listener = function () {
            self._callback();
        };

        const keyMatchingListener = function (event) {
            if (self._keyStringToMatch && new KeyMatcher().match(self._keyStringToMatch).withEvent(event)) {
                self._callback();
            }
        };

        return (this._keyStringToMatch) ? keyMatchingListener : listener;
    }

    static _removeKeasyEventSpace(eventString) {
        return eventString.replace(keasyEventSpace, "");
    }

    _hasDelay() {
        return _isInteger(this._delay);
    }

    static _toMilliseconds(amount, unit) {
        if (amount > 0) {
            switch (unit) {
                case seconds:
                    return amount * 1000;
                case minutes:
                    return amount * 60 * 1000;
                default:
                    return amount;
            }
        }
        else {
            return 0;
        }
    }
}