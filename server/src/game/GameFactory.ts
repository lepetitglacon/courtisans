import Game from "./game";
import {Game as DBGame} from "../db/schema/game";
import {Server} from "socket.io";

export default class GameFactory {
    private games: Map<String, Game>;
    private io: Server;

    constructor(io: Server) {
        this.io = io
        this.games = new Map<String, Game>()
    }

    async create(options: any) {
        const game = new Game(this.io)
        game.title = options?.title ?? 'No title'
        game.training = options?.training === 'on'
        game.trainingBots = parseInt(options?.trainingBots) ?? 0

        game.roomId = options?.roomId ?? null
        await game.bind()
        await game.init()
        this.games.set(game.roomId, game)
        console.log(`[DB] new game ${game.roomId}`)
        return game
    }

    async initFromDB() {
        const gamesToLoad = await DBGame.find({})
        console.log(`[DB] games to init {${gamesToLoad.length}}`)
        await new Promise(async (res, rej): Promise<any> => {
            for (const gameFromDB of gamesToLoad) {
                await this.create({
                    title: gameFromDB.title,
                    roomId: gameFromDB.id
                })
            }
            return res(true)
        })

        console.log(`[DB] all games are init`)
    }

}