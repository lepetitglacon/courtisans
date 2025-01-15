export default class ActionValidator {

    constructor(game) {
        this.game = game

        this.HIGHER_ACTIONS = {
            GIVE: 'give',
            PLACE: 'place',
            KEEP: 'keep',
        }

        this.actionsToPlay = new Set(Object.values(this.HIGHER_ACTIONS))

    }

    initForCurrentUser() {
        this.actionsToPlay = new Set(Object.values(this.HIGHER_ACTIONS))
    }

    isValidAction(socket) {
        if (socket.id !== this.game.userTurnId) {
            console.warn('not your turn', socket.id)
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
        if (!otherUser && (data.action === 'give' || ['kill_other', 'kill_own'].includes(data.action))) {
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

        // enlight -> même famille
        // shadow -> même famille
        // kill at table -> rogue + carte pas shield + puis placer la carte ou on veut sur la table
        // kill other player -> rogue + carte pas shield + puis placer la carte ou on veut sur la table
        // kill own card
        // give card to other player
        const authorizedActions = ['']

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

        switch (data.action) {
            case 'enlight':
            case 'shadow':
                if (card.family.id !== data.familyId) {
                    return {
                        isValid: false,
                        reason: `Card ${card.family.id} has not the same family ${data.familyId}`
                    }
                }
                data.action === 'enlight'
                    ? this.game.familyCards[card.family.id].enlighten.push(card)
                    : this.game.familyCards[card.family.id].shadowed.push(card)

                user.handCards.splice(user.handCards.indexOf(card), 1)
                break;
            case 'kill_crown':
                console.log(this.game.familyCards[data.familyId])
                this.game.familyCards[data.familyId].splice(this.game.familyCards[data.familyId].indexOf(card), 1)
                user.handCards.splice(user.handCards.indexOf(card), 1)
                break;
            case 'kill_other':
            case 'kill_own':
                // TODO
                break
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

    process(data, user) {
        switch (data.action) {
            case 'enlight':

                break
            case 'shadow':

                break;
            case 'kill_crown':
            case 'kill_other':
            case 'kill_own':
                // TODO
                break
            case 'give':
            case 'keep':

                break
        }
    }
}