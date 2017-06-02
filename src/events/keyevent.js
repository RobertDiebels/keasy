import _isString from 'lodash/isString';
import _isEqual from 'lodash/isEqual'

export default class KeyEvent {
    constructor(type) {
        this._type = type;
    }

    toString() {
        return this._type;
    }

    equals(param) {
        if (_isString(param)) {
            return _isEqual(param, this._type);
        }
    }
}