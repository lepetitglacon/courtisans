import POWERS from "../data/powers.js";
import FAMILIES from "../data/families.js";
import MISSIONS from "../data/missions.js";
import STATE from "../shared/gameState.js";
import ActionValidator from "../logic/actionValidator.js";
import MissionCard from "../cards/missionCard.js";
import fillCardsTest from "../tests/fillCardsTest.js";
import EventDispatcher from "../EventDispatcher.js";
import User from "../user.js";
import Card from "../cards/card.js";
import UserUtility from "../utility/UserUtility.js";
import Bot from "../logic/bot";
import { Game as DBGame } from "../db/schema/game";
import {shuffleArray} from "../utils.js";
import { fakerFR as faker } from '@faker-js/faker';
import * as Mongoose from "mongoose";
import {Server} from "socket.io";
import {randomInt} from "../utility/random";

export default class Game {
    title: string;
    private NUMBER_OF_CARDS_PER_FAMILY: number;
    private HAND_SIZE: number;
    private MISSION_HAND_SIZE: number;
    private model: Mongoose.Model<any>;
    private io: Server;
    private roomId: string;
    private eventDispatcher: EventDispatcher;
    private actionValidator: ActionValidator;
    private userUtility: UserUtility;
    private score: { families: {}; users: {} };
    private state: string;
    private started: boolean;
    private userTurnId: number;
    private users: User[];
    private initialDeck: Card[];
    private cards: Card[];
    private missionCards: MissionCard[];
    private familyCards: {};
    private tests: {};
    private bots: Bot[];
    private training: boolean;
    private trainingBots: number;
    private modelInstance: any;

    constructor(io: Server) {
        this.NUMBER_OF_CARDS_PER_FAMILY = 15
        this.HAND_SIZE = 3
        this.MISSION_HAND_SIZE = 2

        this.model = DBGame

        this.io = io;
        this.roomId = ''
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
        this.userTurnId = 0

        this.users = []
        this.initialDeck = []
        this.cards = []
        this.missionCards = []
        this.familyCards = {}

        this.tests = {}
        this.tests.fillCards = new fillCardsTest(this)

        this.bots = []
        this.training = false
        this.trainingBots = 0
    }

    async init() {
        this.started = false
        this.changeState(this.users.length ? STATE.WAITING_FOR_START : STATE.WAITING_FOR_PLAYERS)

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
            this.modelInstance.crdate = new Date()
            await this.modelInstance.save()
            this.roomId = this.modelInstance.id
        }

        if (this.training) {
            if (this.trainingBots <= 0 || this.trainingBots > 4) {
                throw new Error("Training bots needs to be between 1 and 4")
            }

            if (this.bots.length) {
                this.bots.forEach(bot => bot.socket.connect())
            } else {
                console.log('adding bots', this.trainingBots)
                for (let i = 0; i < this.trainingBots; i++) {
                    const bot = new Bot(this)
                    this.bots.push(bot)
                }
            }
        }

        this.update()
    }

    initCards() {
        let cardId = 0
        for (const family of Object.values(FAMILIES).filter(family => family.id !== 'assassin')) {
            for (const i in [...Array(this.NUMBER_OF_CARDS_PER_FAMILY).keys()].map(i => parseInt(i))) {
                const card = new Card({
                    family: family,
                    power: POWERS.NORMAL
                })
                switch (true) {
                    case i <= 3: { card.power = POWERS.SHIELD } break;
                    case i <= 7: { card.power = POWERS.NOBLE } break;
                    case i <= 9: { card.power = POWERS.ROGUE } break;
                    case i <= 11: { card.power = POWERS.HIDDEN } break;
                }
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
        shuffleArray(this.missionCards)
        shuffleArray(this.cards)
        // retirer les cartes en fonction du nombre de joueurs
        let numberOfCardsToRemoveBasedOnPlayers
        switch (this.users.length) {
            case 2: numberOfCardsToRemoveBasedOnPlayers = 30; break;
            case 3: numberOfCardsToRemoveBasedOnPlayers = 18; break;
            case 4: numberOfCardsToRemoveBasedOnPlayers = 6; break;
            default: numberOfCardsToRemoveBasedOnPlayers = 0; break;
        }
        for (let i = 0; i < numberOfCardsToRemoveBasedOnPlayers; i++) {
            this.cards.pop()
        }

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

        if (this.users.length === 0 || this.training) {
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
        // GAME actions
        socket.on('client/message', (data) => {
            this.io.to(this.roomId).emit('message', data)
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
        this.users = this.users.filter(user => user.socket.connected)

        this.initCards()
        this.shuffleCards()
        this.distributeCardsToEveryPlayer()

        this.userTurnId = this.users[randomInt(0, this.users.length - 1)].socket.id
        this.actionValidator.initForCurrentUser()

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
        const winner = {
            id: '',
            name: '',
            total: 0
        }

        // remettre les cartes cachées dans les familles
        for (const card of this.familyCards['assassin'].enlighten) {
            this.familyCards[card.family.id].enlighten.push(card)
        }
        this.familyCards['assassin'].enlighten.length = 0
        for (const card of this.familyCards['assassin'].shadowed) {
            this.familyCards[card.family.id].shadowed.push(card)
        }
        this.familyCards['assassin'].shadowed.length = 0

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

        for (const user of this.users) {
            for (const missionCard of user.missionCards) {
                let ok = false

                const currentIndex = this.users.indexOf(user)
                let newIndex = currentIndex + (missionCard.ordre ? 1 : -1)
                if (newIndex > this.users.length - 1) {
                    newIndex = 0
                }
                if (newIndex < 0) {
                    newIndex = this.users.length - 1
                }
                const otherUser = this.users[newIndex]

                switch (missionCard.type) {
                    case 'MoreThan': {
                        missionCard.otherUserId = otherUser.socket.id
                        ok = user.cards.filter(card => card.family.id === missionCard.family.id).length
                            > otherUser.cards.filter(card => card.family.id === missionCard.family.id).length;
                        break;
                    }
                    case 'lessThan': {
                        missionCard.otherUserId = otherUser.socket.id
                        ok = user.cards.filter(card => card.family.id === missionCard.family.id).length
                            < otherUser.cards.filter(card => card.family.id === missionCard.family.id).length;
                        break;
                    }
                    case 'Enlighten': {
                        ok = families[missionCard.family.id] === 1
                        break;
                    }
                    case 'Shadowed': {
                        ok = families[missionCard.family.id] === -1
                        break;
                    }
                }
                missionCard.isValid = ok
                if (!this.score.users[user.socket.id]['Missions']) {
                    this.score.users[user.socket.id]['Missions'] = 0
                }
                this.score.users[user.socket.id]['Missions'] += ok ? 3 : 0
            }

            const total = Object.values(this.score.users[user.socket.id]).reduce((acc, el) => {
                return acc += el
            }, 0)
            this.score.users[user.socket.id]['Total'] = total

            if (total > winner.total) {
                winner.id = user.socket.id
                winner.name = user.name
                winner.total = total
            }
        }

        this.io.to(this.roomId).emit('message', {
            user: `[ORDI] -> `,
            message: `-- Résultats -- `
        })

        this.io.to(this.roomId).emit('message', {
            user: `[ORDI] -> `,
            message: `Gagnant du banquet : ${winner.name}: <br> avec ${winner.total} points !`
        })
        this.io.to(this.roomId).emit('message', {
            user: `[ORDI] -> `,
            message: ``
        })

        for (const user of this.users) {
            if (user.socket.id === winner.id) {
                continue
            }
            this.io.to(this.roomId).emit('message', {
                user: `[ORDI] -> `,
                message: `${user.name}: ${this.score.users[user.socket.id].Total}`
            })
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

        if (this.state === STATE.PLAYING && this.getRemainingCardsToPlay() <= 0) {
            this.changeState(STATE.COUNTING)
            this.countCardForEndgame()
            this.update()
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