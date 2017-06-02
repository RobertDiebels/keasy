export const ctrl = 'CTRL';
export const alt = 'ALT';
export const shift = 'SHIFT';

export default class KeyMatcher {

    constructor() {
        this._keys = [];
    }

    /**
     * @desc Sets a {String} of keys this instance of {@link KeyMatcher} should match for calls to {@link KeyMatcher.withEvent}.
     * @param {String} keyString - A {@link String} of the form "keyX+keyY+...+KeyN".
     * @returns {KeyMatcher}
     */
    match(keyString) {
        const keys = keyString.split('+');
        this._setKeysToMatch(keys);
        return this;
    }

    /**
     * @desc Matches the keys passed to {@link KeyMatcher.match} with the passed {@link KeyBoardEvent}.
     * @param {KeyBoardEvent} event - A {@link KeyBoardEvent} the keys passed to {@link KeyMatcher.match} will be matched with.
     * @returns {boolean}
     */
    withEvent(event) {
        const EVENT_TYPE_ERROR = "KeyMatcher.with(event) expects a KeyBoardEvent. This isn't one.";
        if (event instanceof KeyboardEvent) {
            return !!this._matchesKeys(event);
        }
        else {
            throw new TypeError(EVENT_TYPE_ERROR)
        }
    }

    _setKeysToMatch(keys) {
        keys.forEach((key) => {
            switch (key) {
                case ctrl:
                    this._verifyCtrl();
                    break;
                case alt:
                    this._verifyAlt();
                    break;
                case shift:
                    this._verifyShift();
                    break;
                default:
                    this._verifyKey(key);
            }
        });
    }

    _verifyCtrl() {
        this._checkCtrl = true;
    }

    _verifyAlt() {
        this._checkAlt = true;
    }

    _verifyShift() {
        this._checkShift = true;
    }

    _verifyKey(key) {
        this._keys.push(key);
    }

    /**
     * @param {KeyBoardEvent} event - A {@link KeyBoardEvent} this instance of {@link KeyMatcher} matches its keys to.
     * @returns {boolean|*}
     * @private
     */
    _matchesKeys(event) {
        let matchesAllKeys = false;
        for (let i = 0; i < this._keys.length; i++) {
            const key = this._keys[i];
            const matches = (key === event.key);
            matchesAllKeys = matches;
            if (!matches) {
                break
            }
        }
        return matchesAllKeys && this._shouldMatchFunctionKeys(event);
    }

    _shouldMatchFunctionKeys(event) {
        this._shouldMatchCtrl(event.ctrlKey) && this._shouldMatchAlt(event.altKey) && this._shouldMatchShift(event.shiftKey);
    }

    _shouldMatchShift(pressedShift) {
        return KeyMatcher._shouldMatchFunctionKey(pressedShift, this._checkShift)
    }

    _shouldMatchCtrl(pressedCtrl) {
        return KeyMatcher._shouldMatchFunctionKey(pressedCtrl, this._checkCtrl)
    }

    _shouldMatchAlt(pressedAlt) {
        return KeyMatcher._shouldMatchFunctionKey(pressedAlt, this._checkAlt)
    }

    static _shouldMatchFunctionKey(pressedFunctionKey, shouldMatch) {
        if (shouldMatch) {
            return pressedFunctionKey === shouldMatch;
        }
        return true;
    }
}