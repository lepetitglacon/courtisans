import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: String,
    state: String,
    crdate: Date
}, {
    collection: 'games'
});

const Game = mongoose.model('Game', gameSchema);

export { gameSchema, Game }