import User from "../user.js";
import Card from "../cards/card.js";
import { Game as DBGame } from "../db/schema/game";
import POWERS from "../data/powers.js";
import FAMILIES from "../data/families.js";
import MISSIONS from "../data/missions.js";
import STATE from "../shared/gameState.js";
import {shuffleArray} from "../utils.js";
import ActionValidator from "../logic/actionValidator.js";
import MissionCard from "../cards/missionCard.js";
import fillCardsTest from "../tests/fillCardsTest.js";
import EventDispatcher from "../EventDispatcher.js";

import { fakerFR as faker } from '@faker-js/faker';
import UserUtility from "../utility/UserUtility.js";

export default class Game {

    constructor(io) {
        this.NUMBER_OF_CARDS_PER_FAMILY = 15
        this.HAND_SIZE = 3
        this.MISSION_HAND_SIZE = 2

        this.model = DBGame

        this.io = io;
        this.roomId = null
        this.title = ''

        this.eventDispatcher = new EventDispatcher()
        this.actionValidator = new ActionValidator(this);

        this.userUtility = new UserUtility(this);

        this.score = {
            users: {},
            families: {}
        }

        this.state = STATE.WAITING_FOR_PLAYERS
        this.started = false
        this.userTurnId = null

        this.users = []
        this.initialDeck = []
        this.cards = []
        this.missionCards = []
        this.familyCards = {}

        this.tests = {}
        this.tests.fillCards = new fillCardsTest(this)

    }

    async init() {
        this.started = false
        this.changeState(STATE.WAITING_FOR_PLAYERS)

        this.score = {
            users: {},
            families: {}
        }

        for (const family of Object.values(FAMILIES)) {
            this.familyCards[family.id] = {
                enlighten: [],
                shadowed: []
            }
        }

        if (this.roomId !== null) {
            this.modelInstance = await this.model.findOne({_id: this.roomId})
            this.roomId = this.modelInstance.id
        } else {
            this.modelInstance = new this.model({title: this.title, state: this.state})
            await this.modelInstance.save()
            this.roomId = this.modelInstance.id
        }

        this.initCards()
        this.update()
        console.log(`[${this.roomId}] init`)
    }

    initCards() {
        let cardId = 0
        for (const family of Object.values(FAMILIES).filter(family => family.id !== 'assassin')) {
            for (const i in [...Array(this.NUMBER_OF_CARDS_PER_FAMILY).keys()].map(i => parseInt(i))) {
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

        for (const family of Object.values(FAMILIES).filter(family => family.id !== 'assassin')) {
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

    async bind() {
        this.io.on('connection', (socket) => {
            this.handleConnect(socket)
        });

        // SOCKET
        this.eventDispatcher.on('game:user:disconnect:disconnected', (user, socket) => {
            const connectedUsers = this.users.filter(user => user.socket.connected)
            if (connectedUsers <= 2 && this.state === STATE.WAITING_FOR_START) {
                this.changeState(STATE.WAITING_FOR_PLAYERS)
            }
            console.log(`user left, still have ${User.disconnectTimeOut / 1000}sec to reconnect`, socket.id);
            this.update()
        })
        this.eventDispatcher.on('game:user:disconnect:timeout', (user, socket) => {
            this.users.splice(this.users.indexOf(user), 1)
            if (this.users.length <= 1 && this.state === STATE.WAITING_FOR_START) {
                this.changeState(STATE.WAITING_FOR_PLAYERS)
            }
            console.log('a user disconnected', socket.id);
            this.update()
        })

        // GAME
        this.eventDispatcher.on('client/play', (data, socket) => {
            this.playAction(data, socket)
        })
        this.eventDispatcher.on('changeState', async (state) => {
            if (this.modelInstance) {
                this.modelInstance.state = state
                await this.modelInstance.save()
            }
            console.log(`[${this.roomId}] saved`)
            if (state === STATE.COUNTING) {
                this.countCardForEndgame()
            }
        })
    }

    handleConnect(socket) {
        const socketRoomId = socket.handshake.query.roomId
        if (socketRoomId !== this.roomId) {
            return
        }

        const user = new User(faker.person.fullName(), socket);
        socket.join(this.roomId)

        socket.on('disconnect', () => {
            this.eventDispatcher.emit('game:user:disconnect:disconnected', user, socket)
            setTimeout(() => {
                this.eventDispatcher.emit('game:user:disconnect:timeout', user, socket)
            }, User.disconnectTimeOut)
        })
        this.bindSocket(socket)

        if (this.users.length === 0) {
            user.admin = true
        }

        this.users.push(user);

        if (
            this.users.length > 1 &&
            this.state === STATE.WAITING_FOR_PLAYERS
        ) {
            this.changeState(STATE.WAITING_FOR_START)
        }

        this.update()
        console.log('a user connected', socket.id);
    }

    bindSocket(socket) {
        // ADMIN
        socket.on('client/admin/start', (data) => {
            console.log(socket.id, 'starting the game')
            if (this.users.length > 1) {
                this.start()
            }
        })
        socket.on('client/admin/restart', (data) => {
            console.log(socket.id, 'restarting the game')
            this.restart()
        })
        socket.on('client/admin/delete', (data) => {
            console.log(socket.id, 'deleting the game')
            this.delete()
        })
        socket.on('client/admin/test', (data) => {
            console.log('run tests')
            this.tests.fillCards.test()
        })

        // GAME actions
        socket.on('client/play', (data) => {
            this.playAction(data, socket)
        })
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
        this.shuffleCards()
        this.distributeCardsToEveryPlayer()

        this.userTurnId = this.users[0].socket.id
        this.actionValidator.initForCurrentUser()

        this.users = this.users.filter(user => user.socket.connected)
        this.started = true
        this.changeState(STATE.PLAYING)
        this.update()
    }

    playAction(data, socket) {
        if (!this.actionValidator.isValidAction(socket)) { return }

        const user = this.userUtility.findUserFromSocket(socket)
        const validationResult = this.actionValidator.validate(data, user)

        socket.emit('server/validationResult', {valid: validationResult.isValid})
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
    }

    distributeCardsToEveryPlayer() {
        for (const user of this.users) {
            this.drawCardsForUser(user)
        }

        const missionCardsToDistribute = this.users.length * this.MISSION_HAND_SIZE
        for (let i = 0; i < missionCardsToDistribute; i++) {
            this.users[i % this.users.length].missionCards.push(...this.drawMissionCards())
        }
    }

    drawCardsForUser(user) {
        for (let i = 0; i < this.HAND_SIZE; i++) {
            if (this.canDrawCard()) {
                user.handCards.push(...this.drawCards())
            } else {
                console.info('trying to draw while there is no card left')
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

    drawMissionCards(numberOfCards = 1) {
        const cards = []
        for (let i = 0; i < numberOfCards; i++) {
            cards.push(this.missionCards.pop())
        }
        return cards
    }

    countCardForEndgame() {
        const families = {}
        for (const family of Object.values(FAMILIES)) {
            const familiesEnlightenmentStatus = this.familyCards[family.id].enlighten.length - this.familyCards[family.id].shadowed.length

            if (familiesEnlightenmentStatus > 0) {
                families[family.id] = 1
            } else if (familiesEnlightenmentStatus === 0) {
                families[family.id] = 0
            } else {
                families[family.id] = -1
            }

            for (const user of this.users) {

                let score = 0
                for (const card of user.cards.filter(c => c.family.id === family.id)) {
                    score += families[card.family.id] * (card.power === 'noble' ? 2 : 1)
                }
                if (!this.score.users[user.socket.id]) {
                    this.score.users[user.socket.id] = {}
                }
                this.score.users[user.socket.id][family.id] = score
            }
        }

        this.score.families = families
        console.log(this.score)
    }

    getRemainingCardsToPlay() {
        let numberOfCards = this.cards.length
        for (const user of this.users) {
            numberOfCards += user.handCards.length
        }
        return numberOfCards
    }

    changeState(newState) {
        this.state = newState
        this.eventDispatcher.emit('changeState', newState)
    }

    /**
     * Update state for every player
     */
    update() {
        this.io.to(this.roomId).emit('game:update', this.toJson())

        if (this.getRemainingCardsToPlay() <= 0) {
            this.changeState(STATE.COUNTING)
            this.io.emit('game:end:start', this.toJson())
        }
    }

    toJson() {
        const state = {}
        state.state = this.state
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
        state.score = this.score
        return state
    }

    delete() {
        this.modelInstance.remove()
        this.state = STATE.ENDED
    }
}