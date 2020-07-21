import Intersection from './models/Intersection';
import Location from './models/Location';

export type Coordinate = [number, number];
export interface CoordinateXY {
    x: number;
    y: number;
}
export type Waypoint = Intersection | Location;
