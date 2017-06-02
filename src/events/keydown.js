import KeyEvent from './keyevent';

export default class KeyDown extends KeyEvent {
    constructor() {
        super('keydown');
    }
}