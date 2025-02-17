import STATE from "../shared/gameState.js";

export default class fillCardsTest {

    constructor(game) {
        this.game = game
        this.turns = 15
    }

    test() {
        this.game.NUMBER_OF_CARDS_PER_FAMILY = 15
        this.game.eventDispatcher.on('changeState', (state) => {
            console.log(state)
            // if (state === STATE.PLAYING) {
            //     for (let i = 0; i < this.turns; i++) {
            //
            //         if (this.game.cards < 1) {
            //             break
            //         }
            //
            //         for (const user of this.game.users) {
            //             if (user.socket.id === this.game.userTurnId) {
            //
            //                 this.game.eventDispatcher.emit('client/play', {
            //                     action: Math.random() > .5 ? 'enlight' : 'shadow',
            //                     familyId: user.handCards[0].family.id,
            //                     cardId: user.handCards[0].id,
            //                 }, user.socket)
            //
            //                 this.game.eventDispatcher.emit('client/play', {
            //                     action: 'give',
            //                     familyId: user.handCards[0].family.id,
            //                     cardId: user.handCards[0].id,
            //                     toUserId: this.game.users.find(u => u.socket.id !== user.socket.id).socket.id,
            //                 }, user.socket)
            //
            //                 this.game.eventDispatcher.emit('client/play', {
            //                     action: 'keep',
            //                     familyId: user.handCards[0].family.id,
            //                     cardId: user.handCards[0].id,
            //                 }, user.socket)
            //             }
            //         }
            //     }
            // }

        })
    }

}