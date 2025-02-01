import 'dotenv/config'

import express from 'express';
import cors from 'cors'
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import Game from "./game.js";
import { Game as DBGame} from "./db/schema/game.js";

import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server);

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

app.get('/games', async (req, res) => {
    return res.json(await DBGame.find({}))
})

async function getDB() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.${process.env.MONGO_SERVER}/`, {
        dbName: 'Courtisans'
    });
    console.log('DB connected')
    const game = new DBGame({title: 'TEST Game'})
    await game.save()
}
getDB()

const game = new Game(io);