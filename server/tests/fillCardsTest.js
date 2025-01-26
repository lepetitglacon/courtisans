import STATE from "../shared/gameState.js";

export default class fillCardsTest {

    constructor(game) {
        this.game = game
    }

    test() {
        this.game.eventDispatcher.on('changeState', (state) => {
            console.log(state)
            if (state === STATE.PLAYING) {
                for (const user of this.game.users) {
                    if (user.socket.id === this.game.userTurnId) {

                        this.game.eventDispatcher.emit('client/play', {
                            action: 'enlight',
                            familyId: user.handCards[0].family.id,
                            cardId: user.handCards[0].id,
                        }, user.socket)

                        this.game.eventDispatcher.emit('client/play', {
                            action: 'give',
                            familyId: user.handCards[0].family.id,
                            cardId: user.handCards[0].id,
                            toUserId: this.game.users.find(u => u.socket.id !== user.socket.id).socket.id,
                        }, user.socket)

                        this.game.eventDispatcher.emit('client/play', {
                            action: 'keep',
                            familyId: user.handCards[0].family.id,
                            cardId: user.handCards[0].id,
                        }, user.socket)
                    }
                }
            }
        })
    }

}