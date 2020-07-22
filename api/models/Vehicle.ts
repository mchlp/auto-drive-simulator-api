import Road from './Road';
import constants from '../constants';
import util from '../util';
import {
    CoordinateXY,
    Coordinate,
    Waypoint,
    RouteSegment,
    Route,
} from '../types';
import Map from './Map';

export default class Vehicle {
    id: string;
    distanceTravelledOnRoad: number;
    curRouteSegmentIndex: number;
    route: Route;
    map: Map;
    lastUpdated: number;

    constructor(route: Route, map: Map) {
        this.id = Vehicle.getNextId();
        this.route = route;
        this.distanceTravelledOnRoad = 0;
        this.curRouteSegmentIndex = 0;
        this.map = map;
        this.lastUpdated = Date.now();
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'vehicle_' + Vehicle.idCount;
        Vehicle.idCount++;
        return nextId;
    }

    getCurRouteSegment() {
        return this.route[this.curRouteSegmentIndex];
    }

    getCurRoad() {
        return this.map.roads[this.getCurRouteSegment().roadId];
    }

    getCurHeading() {
        const curRoad = this.getCurRoad();
        if (curRoad.end.id === this.getCurRouteSegment().exitPointId) {
            return constants.VEHICLE_HEADING.TOWARDS_END;
        } else {
            return constants.VEHICLE_HEADING.TOWARDS_START;
        }
    }

    update() {
        const nowTime = Date.now();
        const deltaTimeSec = (nowTime - this.lastUpdated) / 1000;
        this.lastUpdated = nowTime;

        const maxSpeed = 100;
        let newDistanceTravelledOnRoad =
            this.distanceTravelledOnRoad + maxSpeed * deltaTimeSec;

        if (newDistanceTravelledOnRoad > this.getCurRoad().getLength()) {
            if (this.curRouteSegmentIndex < this.route.length - 1) {
                newDistanceTravelledOnRoad = 0;
                this.curRouteSegmentIndex++;
            } else {
                newDistanceTravelledOnRoad = this.distanceTravelledOnRoad;
            }
        }
        this.distanceTravelledOnRoad = newDistanceTravelledOnRoad;
    }

    getCoord(): Coordinate {
        let roadSlope: CoordinateXY = {
            x: 0,
            y: 0,
        };
        let startPosition: CoordinateXY = {
            x: 0,
            y: 0,
        };
        const heading = this.getCurHeading();
        const road = this.getCurRoad();
        if (heading === constants.VEHICLE_HEADING.TOWARDS_END) {
            roadSlope = {
                x: road.end.coord[0] - road.start.coord[0],
                y: road.end.coord[1] - road.start.coord[1],
            };
            startPosition = {
                x: road.start.coord[0],
                y: road.start.coord[1],
            };
        } else if (heading === constants.VEHICLE_HEADING.TOWARDS_START) {
            roadSlope = {
                x: road.start.coord[0] - road.end.coord[0],
                y: road.start.coord[1] - road.end.coord[1],
            };
            startPosition = {
                x: road.end.coord[0],
                y: road.end.coord[1],
            };
        }

        const roadSlopeNormalized = util.normalizedCoordinateXY(roadSlope);

        return [
            startPosition.x +
                roadSlopeNormalized.x * this.distanceTravelledOnRoad,
            startPosition.y +
                roadSlopeNormalized.y * this.distanceTravelledOnRoad,
        ];
    }

    serialize() {
        return {
            id: this.id,
            coord: this.getCoord(),
            originId: this.route[0].entryPointId,
            destinationId: this.route[this.route.length - 1].exitPointId,
        };
    }
}
