import Card from "./card.js";
import {randomBytes} from "node:crypto";

export default class MissionCard extends Card{

    constructor(info) {
        super(info);
        this.type = info.type
        this.ordre = Math.random() < 0.5
        this.text = this.parseText(info.text)
    }

    parseText(text) {
        return text
            .replace('[family]', this.family.title)
            .replace('[ordre]', this.ordre ? 'droite' : 'gauche')
    }
}
