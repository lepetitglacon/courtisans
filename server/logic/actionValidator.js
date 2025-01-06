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
        const card = user.cards.find(card => card.id === data.id)
        if (!card) {
            return {
                isValid: false,
                reason: 'Card was not found in user hand'
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
        this.actionsToPlay.delete(higherAction)


        switch (data.action) {
            case 'enlight':
            case 'shadow':
                if (card.family.id !== data.family) {
                    return {
                        isValid: false,
                        reason: `Card ${card.family.id} has not the same family ${data.family.id}`
                    }
                }
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

        return {
            isValid: true,
            reason: ''
        }
    }
}