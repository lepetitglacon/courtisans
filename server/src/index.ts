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

const gameFactory = new GameFactory(io)
gameFactory.initFromDB()

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
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