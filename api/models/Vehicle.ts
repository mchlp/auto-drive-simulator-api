import Road from './Road';
import constants from '../constants';
import util from '../util';
import { CoordinateXY, Coordinate, Waypoint } from '../types';

export default class Vehicle {
    id: string;
    road: Road;
    distanceTravelledOnRoad: number;
    heading: string;

    constructor(road: Road, heading: string, distanceTravelledOnRoad = 0) {
        this.id = Vehicle.getNextId();
        this.road = road;
        this.distanceTravelledOnRoad = distanceTravelledOnRoad;
        this.heading = heading;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'vehicle_' + Vehicle.idCount;
        Vehicle.idCount++;
        return nextId;
    }

    serialize() {
        let roadSlope: CoordinateXY = {
            x: 0,
            y: 0,
        };
        let startPosition: CoordinateXY = {
            x: 0,
            y: 0,
        };
        if (this.heading === constants.VEHICLE_HEADING.TOWARDS_END) {
            roadSlope = {
                x: this.road.end.coord[0] - this.road.start.coord[0],
                y: this.road.end.coord[1] - this.road.start.coord[1],
            };
            startPosition = {
                x: this.road.start.coord[0],
                y: this.road.start.coord[1],
            };
        } else if (this.heading === constants.VEHICLE_HEADING.TOWARDS_START) {
            roadSlope = {
                x: this.road.start.coord[0] - this.road.end.coord[0],
                y: this.road.start.coord[1] - this.road.end.coord[1],
            };
            startPosition = {
                x: this.road.end.coord[0],
                y: this.road.end.coord[1],
            };
        }

        const roadSlopeNormalized = util.normalizedCoordinateXY(roadSlope);

        let vehicleCoord: Coordinate = [
            startPosition.x +
                roadSlopeNormalized.x * this.distanceTravelledOnRoad,
            startPosition.y +
                roadSlopeNormalized.y * this.distanceTravelledOnRoad,
        ];

        return {
            id: this.id,
            coord: vehicleCoord,
        };
    }
}
