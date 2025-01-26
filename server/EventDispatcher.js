import EventEmitter from "node:events";

export default class EventDispatcher extends EventEmitter {

    constructor(game) {
        super();
        this.game = game;
    }


}