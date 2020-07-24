import RoadRenderer from './RoadRenderer';
import LocationRenderer from './LocationRenderer';
import IntersectionRenderer from './IntersectionRenderer';
import VehicleRenderer from './VehicleRenderer';

export default class MapRenderer {
    static renderStatic(staticCtx, mapData, canvasWidth, canvasHeight) {
        staticCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        staticCtx.fillStyle = '#dddddd';
        staticCtx.fillRect(0, 0, canvasWidth, canvasHeight);

        const logoImage = new Image();
        logoImage.src = '/logo192.png';
        logoImage.onload = () => {
            staticCtx.drawImage(logoImage, 0, 0, 50, 50);
        };

        RoadRenderer.render(staticCtx, mapData);
        LocationRenderer.render(staticCtx, mapData);
        IntersectionRenderer.render(staticCtx, mapData);
    }

    static renderDynamic(dynamicCtx, mapData, canvasWidth, canvasHeight) {
        dynamicCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        VehicleRenderer.render(dynamicCtx, mapData);
    }
    static renderAll(
        staticCtx,
        dynamicCtx,
        mapData,
        canvasWidth,
        canvasHeight
    ) {
        this.renderStatic(staticCtx, mapData, canvasWidth, canvasHeight);
        this.renderDynamic(dynamicCtx, mapData, canvasWidth, canvasHeight);
    }
}
