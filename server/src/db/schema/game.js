import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: String,
    state: String
}, {
    collection: 'games'
});

const Game = mongoose.model('Game', gameSchema);

export { gameSchema, Game }