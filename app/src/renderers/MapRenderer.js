import RoadRenderer from './RoadRenderer';
import LocationRenderer from './LocationRenderer';
import IntersectionRenderer from './IntersectionRenderer';
import VehicleRenderer from './VehicleRenderer';

export default class MapRenderer {
    static render(ctx, mapData, canvasWidth, canvasHeight) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const logoImage = new Image();
        logoImage.src = '/logo192.png';
        logoImage.onload = () => {
            ctx.drawImage(logoImage, 0, 0, 50, 50);
        };

        RoadRenderer.render(ctx, mapData);
        LocationRenderer.render(ctx, mapData);
        IntersectionRenderer.render(ctx, mapData);
        VehicleRenderer.render(ctx, mapData);
    }
}
