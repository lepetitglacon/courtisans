export default class User {

    constructor(name, socket) {
        this.name = name;
        this.socket = socket;

        this.admin = false;
        this.handCards = [];
        this.cards = [];
        this.missionCards = [];
    }

    toJson() {
        return {
            name: this.name,
            admin: this.admin,
            socket: this.socket.id,
            handCards: this.handCards,
            cards: this.cards,
            missionCards: this.missionCards,
        }
    }
}