import { Coordinate } from "../types";

export default class Intersection {
    id: string;
    coord: Coordinate;

    constructor(id: string, coord: Coordinate) {
        this.id = id;
        this.coord = coord;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'intersection_' + Intersection.idCount;
        Intersection.idCount++;
        return nextId;
    }

    serialize() {
        return {
            id: this.id,
            coord: this.coord,
        };
    }
}
