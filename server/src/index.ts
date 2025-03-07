import 'dotenv/config'

import express, {Request, Response} from 'express';
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Game as DBGame} from "./db/schema/game.js";
import mongoose from "mongoose";
import GameFactory from "./game/GameFactory";

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'localhost:5173',
]

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

getDB()
deleteEndedGames()

const gameFactory = new GameFactory(io)
gameFactory.initFromDB()

server.listen(process.env.SERVER_PORT, () => {
    console.log(`server running at http://localhost:${process.env.SERVER_PORT}`);
});
app.all('*', function(req, res, next) {
    const origin = allowedOrigins.includes(req.header('origin')?.toLowerCase() ?? '') ? req.headers.origin : allowedOrigins[0];
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/games',  async (req: Request, res: Response): Promise<any> => {
    return res.json(await DBGame.find({}))
})
app.post('/create',  async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body)
        const game = await gameFactory.create({
            ...req.body
        })

        return res.json({
            roomId: game.roomId
        })
    } catch (e) {
        console.error(e)
    }
})
app.get('/',  async (req: Request, res: Response): Promise<any> => {
    res.set('Content-Type', 'text/html');
    return res.send(`<a href="${process.env.FRONTEND_URL}">Aller sur le site</a>`)
})

async function getDB() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_SERVER}/`, {
        dbName: 'Courtisans'
    });
    console.log('DB connected')
}

function deleteEndedGames() {
    // console.log('[DB] deleteEndedGames')
    // setInterval(async () => {
    //     const games = await DBGame.find({})
    //     for (const game of games) {
    //         if (!game.crdate || game.crdate.getDate() + 50000 < Date.now()) {
    //             await DBGame.deleteOne({_id: game.id})
    //             console.log(`[DB] ${game.id} deleted by time`)
    //         }
    //     }
    // }, 50000)
}