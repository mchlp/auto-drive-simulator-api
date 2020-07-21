export default class Utils {
    static canvasProps;
    static canvasWidth;
    static canvasHeight;

    static getCoordFromWaypoint(waypointName, mapData) {
        if (waypointName.startsWith('intersection')) {
            return mapData.intersections[waypointName].coord;
        } else if (waypointName.startsWith('location')) {
            return mapData.locations[waypointName].coord;
        }
        return null;
    }

    static initUtils(canvasProps, canvasWidth, canvasHeight) {
        Utils.canvasProps = canvasProps;
        Utils.canvasWidth = canvasWidth;
        Utils.canvasHeight = canvasHeight;
    }

    static mapArrayCoord(arrayCoord) {
        if (arrayCoord) {
            return arrayCoord.map(Utils.mapSingleCoord);
        }
        return null;
    }

    static scaleSingleCoord(singleCoord) {
        return singleCoord * Utils.canvasProps.zoom;
    }

    static mapSingleCoord(singleCoord, index) {
        let scaledCoord = Utils.scaleSingleCoord(singleCoord);
        if (index === 0) {
            scaledCoord += Utils.canvasWidth / 2 - Utils.canvasProps.centerX;
        } else if (index === 1) {
            scaledCoord += Utils.canvasHeight / 2 - Utils.canvasProps.centerY;
        }
        return scaledCoord;
    }
}
