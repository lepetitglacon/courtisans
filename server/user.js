export default class User {

    static disconnectTimeOut = 2000

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
            socket: {
                id: this.socket.id,
                connected: this.socket.connected
            },
            handCards: this.handCards,
            cards: this.cards,
            missionCards: this.missionCards,
        }
    }
}