import Utils from '../Utils';
import constants from '../constants';

export default class LocationRenderer {
    static render(ctx, mapData) {
        Object.entries(mapData.locations).forEach((locationEntry) => {
            const locationId = locationEntry[0];
            const locationData = locationEntry[1];

            const coord = Utils.mapArrayCoord(locationData.coord);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'grey';
            ctx.fillStyle = '#ff0000';
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.arc(coord[0], coord[1], Utils.scaleSingleCoord(2), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });
    }
}
