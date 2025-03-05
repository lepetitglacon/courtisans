import HIGHER_ACTIONS from "../shared/higherActions.js";
import STATE from "../shared/gameState.js";

export default class ActionValidator {

    constructor(game) {
        this.game = game

        this.HIGHER_ACTIONS = HIGHER_ACTIONS
        this.lastKillHigherAction = null
        this.lastKillCardId = null

        this.actionsToPlay = new Set(Object.values(this.HIGHER_ACTIONS))
    }

    initForCurrentUser() {
        this.actionsToPlay = new Set(Object.values(this.HIGHER_ACTIONS))
        this.lastKillHigherAction = null
        this.lastKillCardId = null
    }

    isValidAction(socket) {
        if (socket.id !== this.game.userTurnId) {
            console.warn('not your turn', socket.id)
            return false
        }
        if (this.game.state !== STATE.PLAYING) {
            console.warn(`the game is not in playing state`)
            return false
        }
        return true
    }

    validate(data, user) {
        const card = user.handCards.find(card => card.id === data.cardId)
        if (!card) {
            return {
                isValid: false,
                reason: 'Card was not found in user hand'
            }
        }

        const otherUser = this.game.users.find(User => User.socket.id === data?.toUserId)
        if (!otherUser && (['give', 'kill_other'].includes(data.action))) {
            return {
                isValid: false,
                reason: 'Other user was not found'
            }
        }
        if (['kill_crown', 'kill_other', 'kill_own'].includes(data.action) && card.power !== 'rogue') {
            return {
                isValid: false,
                reason: `Trying to kill with no rogue`,
            }
        }

        // HIGHER ACTION
        let higherAction
        switch (data.action) {
            case 'enlight':
            case 'shadow':
            case 'kill_crown':
                higherAction = this.HIGHER_ACTIONS.PLACE
                break
            case 'give':
            case 'kill_other':
                higherAction = this.HIGHER_ACTIONS.GIVE
                break
            case 'keep':
            case 'kill_own':
                higherAction = this.HIGHER_ACTIONS.KEEP
                break
        }
        if (!this.actionsToPlay.has(higherAction)) {
            return {
                isValid: false,
                reason: `Higher action "${higherAction}" has already been played`,
            }
        }
        console.log(data, higherAction)

        if (this.lastKillHigherAction) {
            if (
                this.lastKillHigherAction !== higherAction
                || data.action === 'kill_crown'
            ) {
                return {
                    isValid: false,
                    reason: `You killed at crown "${higherAction}" you need to place your card`,
                }
            }

            if (card.id !== this.lastKillCardId) {
                return {
                    isValid: false,
                    reason: `You killed at crown "${higherAction}" you need to place your card ${this.lastKillCardId}`,
                }
            }
        }

        switch (data.action) {
            case 'enlight':
            case 'shadow':
                // if (card.family.id !== data.familyId && data.familyId !== 'assassin') {
                //     return {
                //         isValid: false,
                //         reason: `Card ${card.family.id} has not the same family ${data.familyId}`
                //     }
                // }
                if (card.power === 'hidden') {
                    data.action === 'enlight'
                        ? this.game.familyCards['assassin'].enlighten.push(card)
                        : this.game.familyCards['assassin'].shadowed.push(card)

                } else {
                    data.action === 'enlight'
                        ? this.game.familyCards[card.family.id].enlighten.push(card)
                        : this.game.familyCards[card.family.id].shadowed.push(card)
                }

                user.handCards.splice(user.handCards.indexOf(card), 1)
                this.lastKillHigherAction = null
                this.lastKillCardId = null
                break;
            case 'kill_crown': {
                const familiesToTest = [data.familyId, 'assassin']
                let type, otherCard, familyId

                for (const familyIdToTest of familiesToTest) {
                    let family = this.game.familyCards[familyIdToTest]
                    otherCard = family.enlighten.find(card => card.id === data.otherCardId)
                    if (otherCard) {
                        type = 'enlighten'
                        familyId = familyIdToTest
                        break
                    } else {
                        otherCard = family.shadowed.find(card => card.id === data.otherCardId)
                        if (otherCard) {
                            type = 'shadowed'
                            familyId = familyIdToTest
                            break
                        }
                    }
                }

                if (!otherCard || !type) {
                    return {
                        isValid: false,
                        reason: `Card to kill of family ${data.familyId} was not found "${data.otherCardId}"`,
                    }
                }
                if (otherCard.power === 'shield') {
                    return {
                        isValid: false,
                        reason: `Can't kill a shield "${data.otherCardId}"`,
                    }
                }
                this.lastKillHigherAction = higherAction
                this.lastKillCardId = card.id
                this.game.familyCards[familyId][type].splice(this.game.familyCards[familyId][type].indexOf(otherCard), 1)
                break;
            }
            case 'kill_other': {
                const otherCard = otherUser.cards.find(card => card.id === data.otherCardId)
                if (!otherCard) {
                    return {
                        isValid: false,
                        reason: `Card to kill of user ${otherUser.socket.id} was not found "${data.otherCardId}"`,
                    }
                }
                if (otherCard.power === 'shield') {
                    return {
                        isValid: false,
                        reason: `Can't kill a shield "${data.otherCardId}"`,
                    }
                }
                otherUser.cards.splice(otherUser.cards.indexOf(otherCard), 1)
                otherUser.cards.push(card)
                user.handCards.splice(user.handCards.indexOf(card), 1)
                break;
            }
            case 'kill_own': {
                // TODO
                const otherCard = user.cards.find(card => card.id === data.otherCardId)
                if (!otherCard) {
                    return {
                        isValid: false,
                        reason: `Card to kill was not found "${data.otherCardId}"`,
                    }
                }
                if (otherCard.power === 'shield') {
                    return {
                        isValid: false,
                        reason: `Can't kill a shield "${data.otherCardId}"`,
                    }
                }
                user.cards.splice(user.cards.indexOf(otherCard), 1)
                user.cards.push(card)
                user.handCards.splice(user.handCards.indexOf(card), 1)
                break
            }
            case 'give':
                otherUser.cards.push(card)
                user.handCards.splice(user.handCards.indexOf(card), 1)
                break
            case 'keep':
                user.cards.push(card)
                user.handCards.splice(user.handCards.indexOf(card), 1)
                break
        }


        if (data.action !== 'kill_crown') {
            this.actionsToPlay.delete(higherAction)
        }
        return {
            isValid: true,
            reason: ''
        }
    }
}