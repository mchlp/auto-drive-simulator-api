import Road from './Road';
import constants from '../constants';
import util from '../util';
import {
    CoordinateXY,
    Coordinate,
    Waypoint,
    RouteSegment,
    Route,
    RoadType,
    VehicleDirection,
} from '../types';
import Map from './Map';
import Navigator from '../engine/Navigator';
import { exit } from 'process';
import { Intersection } from '.';
import { performance } from 'perf_hooks';

export default class Vehicle {
    id: string;
    distanceTravelledOnRoad: number;
    curRouteSegmentIndex: number;
    route: Route | null;
    map: Map;
    lastUpdated: number;
    origin: Waypoint;
    destination: Waypoint;
    state: string;

    constructor(origin: Waypoint, destination: Waypoint, map: Map) {
        this.id = Vehicle.getNextId();
        this.route = null;
        this.state = constants.VEHICLE_STATE.SPAWNED;
        this.distanceTravelledOnRoad = 0;
        this.curRouteSegmentIndex = 0;
        this.map = map;
        this.lastUpdated = performance.now();
        this.origin = origin;
        this.destination = destination;
    }

    static idCount = 0;
    static getNextId() {
        const nextId = 'vehicle_' + Vehicle.idCount;
        Vehicle.idCount++;
        return nextId;
    }

    calculateRoute() {
        const route = Navigator.getRoute(
            this.origin,
            this.destination,
            this.map
        );
        this.route = route;
        this.distanceTravelledOnRoad = 0;
        this.curRouteSegmentIndex = 0;
        this.state = constants.VEHICLE_STATE.DEPARTURE_READY;
    }

    startDriving() {
        if (this.origin.id !== this.destination.id) {
            this.state = constants.VEHICLE_STATE.EN_ROUTE;
            this.getCurRoad()?.addVehicle(this);
        } else {
            this.state = constants.VEHICLE_STATE.ARRIVED;
        }
    }

    getCurRouteSegment() {
        if (this.state === constants.VEHICLE_STATE.EN_ROUTE) {
            return this.route ? this.route[this.curRouteSegmentIndex] : null;
        }
        return null;
    }

    getCurRoad() {
        const curSegment = this.getCurRouteSegment();
        if (curSegment && this.state === constants.VEHICLE_STATE.EN_ROUTE) {
            return this.map.roads[curSegment.roadId];
        }
        return null;
    }

    getCurDirection(): VehicleDirection | null {
        const curRoad = this.getCurRoad();
        const curSegment = this.getCurRouteSegment();
        if (
            curSegment &&
            curRoad &&
            this.state === constants.VEHICLE_STATE.EN_ROUTE
        ) {
            if (curRoad.end.id === curSegment.exitPointId) {
                return constants.VEHICLE_DIRECTION
                    .TOWARDS_END as VehicleDirection;
            } else {
                return constants.VEHICLE_DIRECTION
                    .TOWARDS_START as VehicleDirection;
            }
        }
        return null;
    }

    _getSpeedMultiplierFromDistance(closestCarAheadDistance: number) {
        if (closestCarAheadDistance > this.map.safeFollowingDistance) {
            return 1;
        } else if (closestCarAheadDistance <= this.map.safeFollowingDistance) {
            return 0;
        } else {
            return 1 - closestCarAheadDistance / this.map.safeFollowingDistance;
        }
    }

    update() {
        const curRoad = this.getCurRoad();
        if (
            this.state === constants.VEHICLE_STATE.EN_ROUTE &&
            curRoad &&
            this.route &&
            this.route.length > 0
        ) {
            const nowTime = performance.now();
            const deltaTimeSec = (nowTime - this.lastUpdated) / 1000;
            this.lastUpdated = nowTime;

            let curSpeed = 10;
            switch (curRoad.type) {
                case constants.ROAD_TYPES.TYPES.MAJOR:
                    curSpeed = 100;
                    break;
                case constants.ROAD_TYPES.TYPES.MINOR:
                    curSpeed = 60;
                    break;
                case constants.ROAD_TYPES.TYPES.LOCAL:
                    curSpeed = 30;
                    break;
            }

            let closestCarAheadDistance = curRoad.getClosestDistanceAhead(this);
            curSpeed *= this._getSpeedMultiplierFromDistance(
                closestCarAheadDistance
            );

            let newDistanceTravelledOnRoad =
                this.distanceTravelledOnRoad + curSpeed * deltaTimeSec;

            if (
                curRoad.getLength() - newDistanceTravelledOnRoad <
                constants.DISPLAY.INTERSECTION_RADIUS * 1.1
            ) {
                // close to entering intersection
                if (this.curRouteSegmentIndex < this.route.length - 1) {
                    // go to next road segment
                    const nextRouteSegment = this.route[
                        this.curRouteSegmentIndex + 1
                    ];
                    const nextRoad = this.map.roads[nextRouteSegment.roadId];
                    let closestCarAheadDistance = nextRoad.getDistanceToFirstVehicleInDirection(
                        nextRouteSegment.exitPointId === nextRoad.end.id
                            ? (constants.VEHICLE_DIRECTION
                                  .TOWARDS_END as VehicleDirection)
                            : (constants.VEHICLE_DIRECTION
                                  .TOWARDS_START as VehicleDirection)
                    );

                    let intersectionAheadOccupied = false;
                    const exitPointId = this.getCurRouteSegment()?.exitPointId;
                    if (
                        exitPointId &&
                        Intersection.isIntersectionId(exitPointId)
                    ) {
                        const exitPointOccupiedVehicleId = this.map.intersections[
                            exitPointId
                        ].getCurOccupiedVehicleId();
                        if (
                            exitPointOccupiedVehicleId &&
                            exitPointOccupiedVehicleId !== this.id
                        ) {
                            intersectionAheadOccupied = true;
                        }
                    }

                    if (
                        exitPointId &&
                        closestCarAheadDistance >
                            this.map.safeFollowingDistance &&
                        !intersectionAheadOccupied
                    ) {
                        this.map.intersections[exitPointId].enterIntersection(
                            this
                        );
                        if (
                            newDistanceTravelledOnRoad >
                            curRoad.getLength() -
                                constants.ROAD_TYPES.WIDTH[nextRoad.type] / 4
                        ) {
                            this.getCurRoad()?.removeVehicle(this);
                            const curRoadType = this.getCurRoad()?.type;
                            if (curRoadType) {
                                newDistanceTravelledOnRoad =
                                    constants.ROAD_TYPES.WIDTH[curRoadType] / 4;
                            } else {
                                newDistanceTravelledOnRoad = 0;
                            }
                            this.curRouteSegmentIndex++;
                            this.getCurRoad()?.addVehicle(this);
                        }
                    } else {
                        newDistanceTravelledOnRoad = this
                            .distanceTravelledOnRoad;
                    }
                } else {
                    newDistanceTravelledOnRoad = curRoad.getLength();
                    this.getCurRoad()?.removeVehicle(this);
                    this.state = constants.VEHICLE_STATE.ARRIVED;
                }
            } else {
                const enterPointId = this.getCurRouteSegment()?.entryPointId;
                if (
                    enterPointId &&
                    Intersection.isIntersectionId(enterPointId) &&
                    this.distanceTravelledOnRoad >
                        constants.DISPLAY.INTERSECTION_RADIUS
                ) {
                    this.map.intersections[enterPointId].exitIntersection(this);
                }
            }

            this.distanceTravelledOnRoad = newDistanceTravelledOnRoad;
        } else if (
            this.state !== constants.VEHICLE_STATE.DEPARTURE_READY &&
            this.state !== constants.VEHICLE_STATE.SPAWNED
        ) {
            this.map.removeVehicle(this);
        }
    }

    getCoord(): Coordinate | null {
        if (
            this.state === constants.VEHICLE_STATE.SPAWNED ||
            this.state === constants.VEHICLE_STATE.DEPARTURE_READY
        ) {
            return this.origin.coord;
        } else if (this.state === constants.VEHICLE_STATE.ARRIVED) {
            return this.destination.coord;
        } else if (this.state === constants.VEHICLE_STATE.EN_ROUTE) {
            const curDirection = this.getCurDirection();
            const curRoad = this.getCurRoad();

            if (curDirection && curRoad) {
                let roadSlope: CoordinateXY = {
                    x: 0,
                    y: 0,
                };
                let startPosition: CoordinateXY = {
                    x: 0,
                    y: 0,
                };

                if (curDirection === constants.VEHICLE_DIRECTION.TOWARDS_END) {
                    roadSlope = {
                        x: curRoad.end.coord[0] - curRoad.start.coord[0],
                        y: curRoad.end.coord[1] - curRoad.start.coord[1],
                    };
                    startPosition = {
                        x: curRoad.start.coord[0],
                        y: curRoad.start.coord[1],
                    };
                } else if (
                    curDirection === constants.VEHICLE_DIRECTION.TOWARDS_START
                ) {
                    roadSlope = {
                        x: curRoad.start.coord[0] - curRoad.end.coord[0],
                        y: curRoad.start.coord[1] - curRoad.end.coord[1],
                    };
                    startPosition = {
                        x: curRoad.end.coord[0],
                        y: curRoad.end.coord[1],
                    };
                }

                const roadSlopeNormalized = util.normalizedCoordinateXY(
                    roadSlope
                );

                const roadCenterPosition = {
                    x:
                        startPosition.x +
                        roadSlopeNormalized.x * this.distanceTravelledOnRoad,
                    y:
                        startPosition.y +
                        roadSlopeNormalized.y * this.distanceTravelledOnRoad,
                };

                const roadPerpSlopeNormalized = {
                    x: roadSlopeNormalized.y,
                    y: roadSlopeNormalized.x,
                };
                if (
                    this.map.roadDrivingSide ===
                    constants.ROAD_DRIVING_SIDE.RIGHT
                ) {
                    roadPerpSlopeNormalized.x *= -1;
                } else {
                    roadPerpSlopeNormalized.y *= -1;
                }

                const allRoadWidths: Record<RoadType, number> =
                    constants.ROAD_TYPES.WIDTH;
                const roadWidth = allRoadWidths[curRoad.type];

                return [
                    roadCenterPosition.x +
                        (roadWidth / 4) * roadPerpSlopeNormalized.x,
                    roadCenterPosition.y +
                        (roadWidth / 4) * roadPerpSlopeNormalized.y,
                ];
            }
            return null;
        }
        return null;
    }

    serialize() {
        return {
            state: this.state,
            id: this.id,
            coord: this.getCoord(),
            origin: this.origin.serialize(),
            destination: this.destination.serialize(),
        };
    }
}
