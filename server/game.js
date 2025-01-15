import User from "./user.js";
import Card from "./cards/card.js";
import POWERS from "./data/powers.js";
import FAMILIES from "./data/families.js";
import {shuffleArray} from "./utils.js";
import ActionValidator from "./logic/actionValidator.js";
import MISSIONS from "./data/missions.js";
import MissionCard from "./cards/missionCard.js";

export default class Game {

    constructor(io) {
        this.HAND_SIZE = 3
        this.MISSION_HAND_SIZE = 2


        this.io = io;
        this.roomId = '0000'
        this.started = false
        this.userTurnId = null

        this.users = []
        this.initialDeck = []
        this.cards = []
        this.missionCards = []
        this.familyCards = {}

        this.actionValidator = new ActionValidator(this);

        this.init()
        this.bind()
    }

    init() {
        this.started = false

        for (const family of Object.values(FAMILIES)) {
            this.familyCards[family.id] = {
                enlighten: [],
                shadowed: []
            }
        }

        this.initCards()
        this.shuffleCards()
        this.update()
        console.log('game init')
    }

    initCards() {
        let cardId = 0
        for (const family of Object.values(FAMILIES)) {
            for (const i in [...Array(15).keys()].map(i => parseInt(i))) {
                const card = new Card({
                    family: family,
                    power: POWERS.NORMAL
                })
                if (i > 3) { card.power = POWERS.SHIELD }
                if (i > 6) { card.power = POWERS.NOBLE }
                if (i > 9) { card.power = POWERS.ROGUE }
                if (i > 12) { card.power = POWERS.HIDDEN }
                card.id = cardId++
                this.cards.push(card)
                this.initialDeck.push(card)
            }
        }

        for (const family of Object.values(FAMILIES)) {
            for (const [missionName, missionOption] of Object.entries(MISSIONS)) {
                const card = new MissionCard({
                    family: family,
                    power: POWERS.NORMAL,
                    type: missionName,
                    ...missionOption
                })
                card.id = cardId++
                this.missionCards.push(card)
            }
        }
    }

    shuffleCards() {
        shuffleArray(this.cards)
        shuffleArray(this.missionCards)
    }

    bind() {
        this.io.on('connection', (socket) => {
            this.handleConnect(socket)
        });
    }


    bindSocket(socket, user) {
        // ADMIN
        socket.on('client/start-request', (data) => {
            console.log(socket.id, 'starting the game')
            if (this.users.length > 1) {
                this.start()
            }
        })
        socket.on('client/admin/restart', (data) => {
            console.log(socket.id, 'restarting the game')
            this.restart()
        })

        // GAME actions
        socket.on('client/play', (data) => {
            if (!this.actionValidator.isValidAction(socket)) { return }
            const validationResult = this.actionValidator.validate(data, user)
            if (!validationResult.isValid) {
                console.log(socket.id, data, validationResult.reason)
                return
            }

            if (user.handCards.length < 1) {
                // fill cards from deck
                this.drawCardsForUser(user)

                // next player
                const index = this.users.indexOf(user)
                if (index === this.users.length - 1) {
                    this.userTurnId = this.users[0].socket.id
                } else {
                    this.userTurnId = this.users[index + 1].socket.id
                }
                this.actionValidator.initForCurrentUser()
            }

            this.update()
        })
    }

    handleConnect(socket) {
        const user = new User('todo', socket);

        socket.on('disconnect', () => {
            this.users.splice(this.users.indexOf(user), 1)
            this.update()
        })
        this.bindSocket(socket, user)

        if (this.users.length === 0) {
            user.admin = true
        }

        this.users.push(user);
        this.update()
        console.log('a user connected', socket.id);
    }

    restart() {
        this.cards.length = 0
        this.missionCards.length = 0

        for (const user of this.users) {
            user.handCards.length = 0
            user.cards.length = 0
            user.missionCards.length = 0
        }

        this.init()
    }

    start() {
        this.started = true

        this.userTurnId = this.users[0].socket.id
        this.actionValidator.initForCurrentUser()
        this.distributeCardsToEveryPlayer()
        this.update()
    }

    distributeCardsToEveryPlayer() {
        const cardsToDistribute = this.users.length * this.HAND_SIZE
        for (let i = 0; i < cardsToDistribute; i++) {
            if (this.canDrawCard()) {
                this.users[i % this.users.length].handCards.push(...this.drawCards())
            } else {
                console.error('trying to draw while there is no card left')
            }
        }

        const missionCardsToDistribute = this.users.length * this.MISSION_HAND_SIZE
        for (let i = 0; i < missionCardsToDistribute; i++) {
            this.users[i % this.users.length].missionCards.push(...this.drawMissionCards())
        }
    }

    drawCardsForUser(user) {
        user.handCards.push(...this.drawCards(this.HAND_SIZE))
    }

    canDrawCard() {
        return this.cards.length > 0
    }

    drawCards(numberOfCards = 1) {
        const cards = []
        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.cards.pop())
        }
        return cards
    }

    drawMissionCards(numberOfCards = 1) {
        const cards = []
        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.missionCards.pop())
        }
        return cards
    }

    /**
     * Update state for every player
     */
    update() {
        this.io.emit('game:update', this.toJson())
    }

    toJson() {
        const state = {}
        state.started = this.started
        state.users = this.users.map(u => u.toJson())
        state.cards = this.cards
        state.familyCards = this.familyCards
        state.userTurnId = this.userTurnId
        state.userActionsToPlay = Array.from(this.actionValidator.actionsToPlay)
        state.infos = {
            FAMILIES,
            POWERS
        }
        return state
    }
}