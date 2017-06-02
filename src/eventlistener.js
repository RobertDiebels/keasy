/**
 * @desc Class which functions as a wrapper which holds a defined listener {@link Function}.
 * This is done to ensure that when a listener {@link Function} is to be removed from and {@link EventTarget} the reference is the same as when it was added.
 */
export default class EventListener {
    /**
     * @param {String} type - The type {String} to
     * @param executor
     */
    constructor(type, executor) {
        this._type = type.toString();
        this._executor = executor;
    }

    /**
     * @desc Binds the defined event-type and executor {@link Function} to the target.
     * @param {EventTarget} target - {@link EventTarget} which should be listened to.
     */
    addTo(target) {
        if (target.addEventListener) {
            target.addEventListener(this._type, this._executor);
        }
        else if (target.attachEvent) {
            target.attachEvent("on" + this._type, this._executor);
        }
    }

    /**
     * Removes the defined event-type and executor {@link Function} to the target.
     * @param {EventTarget} target - {@link EventTarget} which should be listened to.
     */
    removeFrom(target) {
        if (target.removeEventListener) {
            target.removeEventListener(this._type, this._executor);
        }
        else if (target.detachEvent) {
            target.detachEvent(this._type, this._executor);
        }
    }
}