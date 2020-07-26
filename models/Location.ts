import { Coordinate } from "../types";

export default class Location {
    id: string;
    coord: Coordinate;
    
    constructor(id: string, coord: Coordinate) {
        this.id = id;
        this.coord = coord;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'location_' + Location.idCount;
        Location.idCount++;
        return nextId;
    }

    serialize() {
        return {
            id: this.id,
            coord: this.coord,
        };
    }
}