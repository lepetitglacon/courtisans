export default class UserUtility {

    constructor(game) {
        this.game = game;
    }

    findUserFromSocket(socket) {
        return this.game.users.find(user => user.socket.id === socket.id);
    }
}