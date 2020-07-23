import React from 'react';
import Map from './Map';
import { useRef, useState } from 'react';
import Utils from '../Utils';
import SelectedDisplay from './SelectedDisplay';
import constants from '../constants';
import ComponentFinder from '../builder/ComponentFinder';

export default function MapViewer({
    mapData,
    onSelectComponentChange,
    onMouseMove,
}) {
    const containerRef = useRef(null);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const mouseMoveHandler = (event) => {
        if (containerRef && containerRef.current && Utils.ready) {
            const { pageX, pageY } = event;
            const canvasCoordinates = [
                pageX - Utils.canvasOffsetLeft,
                pageY - Utils.canvasOffsetTop,
            ];
            const mapCoordinates = Utils.unmapArrayCoord(canvasCoordinates);
            if (onMouseMove) {
                onMouseMove(mapCoordinates);
            }
            const curSeletedComponent = ComponentFinder.findComponent(
                mapCoordinates,
                mapData
            );
            if (selectedComponent !== curSeletedComponent) {
                setSelectedComponent(curSeletedComponent);
                if (onSelectComponentChange) {
                    onSelectComponentChange(curSeletedComponent);
                }
            }
        }
    };

    return (
        <div>
            <SelectedDisplay componentData={selectedComponent} />
            <div onMouseMove={mouseMoveHandler} ref={containerRef}>
                <Map mapData={mapData} canvasHeightPercentage={0.8} />
            </div>
        </div>
    );
}
