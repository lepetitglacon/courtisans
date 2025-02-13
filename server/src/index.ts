import 'dotenv/config'

import express, {Request, Response} from 'express';
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Game as DBGame} from "./db/schema/game.js";
import mongoose from "mongoose";
import Game from "./game/game";
import GameFactory from "./game/GameFactory";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server);

getDB()
deleteEndedGames()

const gameFactory = new GameFactory(io)
gameFactory.initFromDB()

server.listen(process.env.SERVER_PORT, () => {
    console.log(`server running at http://localhost:${process.env.SERVER_PORT}`);
});
app.get('/games',  async (req: Request, res: Response): Promise<any> => {
    return res.json(await DBGame.find({}))
})
app.post('/create',  async (req: Request, res: Response): Promise<any> => {
    try {
        const game = await gameFactory.create({
            title: req.body.title
        })

        return res.json({
            roomId: game.roomId
        })
    } catch (e) {

    }
})

async function getDB() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_SERVER}/`, {
        dbName: 'Courtisans'
    });
    console.log('DB connected')
}

function deleteEndedGames() {
    console.log('[DB] deleteEndedGames')
    setInterval(async () => {
        const games = await DBGame.find({})
        for (const game of games) {
            if (!game.crdate || game.crdate.getDate() + 50000 < Date.now()) {
                await DBGame.deleteOne({_id: game.id})
                console.log(`[DB] ${game.id} deleted by time`)
            }
        }
    }, 50000)
}