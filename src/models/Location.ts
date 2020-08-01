import { Coordinate } from '../types';

export default class Location {
    id: string;
    coord: Coordinate;
    name: string;

    constructor(id: string, coord: Coordinate, name: string) {
        this.id = id;
        this.coord = coord;
        this.name = name;
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
            name: this.name,
        };
    }
}
