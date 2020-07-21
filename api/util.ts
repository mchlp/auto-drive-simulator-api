import { CoordinateXY } from './types';

export default class util {
    static normalizedCoordinateXY(coord: CoordinateXY): CoordinateXY {
        return {
            x: coord.x / Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2)),
            y: coord.y / Math.sqrt(Math.pow(coord.x, 2) + Math.pow(coord.y, 2)),
        };
    }
}
