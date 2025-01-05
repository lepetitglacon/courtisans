import User from "./user.js";
import Card from "./card.js";
import POWERS from "./data/powers.js";
import FAMILIES from "./data/families.js";
import {shuffleArray} from "./utils.js";

export default class Game {

    constructor(io) {
        this.io = io;
        this.roomId = '0000'
        this.started = false

        this.users = []
        this.cards = []
        this.familyCards = []

        this.init()
        this.bind()
    }

    init() {
        this.started = false
        this.initCards()
        this.shuffleCards()
        this.update()
        console.log('game init')
    }

    initCards() {
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
                this.cards.push(card)
            }
        }
    }

    shuffleCards() {
        shuffleArray(this.cards)
    }

    bind() {
        this.io.on('connection', (socket) => {
            this.handleConnect(socket)
        });
    }

    handleConnect(socket) {
        const user = new User('todo', socket);

        if (this.users.length === 0) {
            user.admin = true
        }

        this.users.push(user);

        socket.on('disconnect', () => {
            this.users.splice(this.users.indexOf(user), 1)
        })
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

        console.log('a user connected', socket.id);
        this.update()
    }

    restart() {
        this.cards.length = 0

        for (const user of this.users) {
            user.cards.length = 0
        }

        this.init()
    }

    start() {
        this.started = true

        this.distributeCards()
        this.update()
    }

    distributeCards() {
        const cardsToDistribute = this.users.length * 3
        for (let i = 0; i < cardsToDistribute; i++) {
            if (this.canDrawCard()) {
                this.users[i % this.users.length].cards.push(...this.drawCards())
            } else {
                console.error('trying to draw while there is no card left')
            }
        }
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
        state.infos = {
            FAMILIES,
            POWERS
        }
        return state
    }
}