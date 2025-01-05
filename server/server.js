import express from 'express';
import cors from 'cors'
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import Game from "./game.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server);

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

const game = new Game(io);