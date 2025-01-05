export default class User {

    constructor(name, socket) {
        this.name = name;
        this.socket = socket;

        this.admin = false;
        this.cards = [];
    }

    toJson() {
        return {
            name: this.name,
            admin: this.admin,
            socket: this.socket.id,
            cards: this.cards,
        }
    }
}