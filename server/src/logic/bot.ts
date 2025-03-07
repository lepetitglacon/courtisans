import { io, Socket } from 'socket.io-client'
import type Game from "../game/game";

export default class Bot {
    private game: Game;
    private socket: Socket;

    constructor(game: Game) {
        this.game = game
        this.socket = io(`http://localhost:3333`, {
            autoConnect: true,
            query: {
                roomId: this.game.roomId
            }
        });

        this.socket.on('connect', () => console.log('bot connected'))
        this.socket.on("game:update", (data) => {
            if (data.userTurnId === this.socket.id) {
                const user = game.users.find((user) => user.socket.id === this.socket.id);

                setTimeout(() => {
                    switch (user.handCards.length) {
                        case 1: {
                            this.socket.emit('client/play', {
                                action: Math.random() > .5 ? 'enlight' : 'shadow',
                                familyId: user.handCards[0].family.id,
                                cardId: user.handCards[0].id,
                            })
                            break;
                        }
                        case 2: {
                            this.socket.emit('client/play', {
                                action: 'give',
                                familyId: user.handCards[0].family.id,
                                cardId: user.handCards[0].id,
                                toUserId: this.game.users.find(u => u.socket.id !== user.socket.id).socket.id,
                            })
                            break;
                        }
                        case 3: {
                            this.socket.emit('client/play', {
                                action: 'keep',
                                familyId: user.handCards[0].family.id,
                                cardId: user.handCards[0].id,
                            })
                            break;
                        }
                    }
                }, Math.random() * 1000)

            }
        });
    }
}