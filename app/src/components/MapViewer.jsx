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
    onHoverComponentChanged,
    onMouseMove,
    onMouseDown,
    curPointerRadius,
    curPointerComponentId,
    cursorStyle,
}) {
    const containerRef = useRef(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [hoveredComponent, setHoveredComponent] = useState(null);

    const getMapCoordinatesFromMouseEvent = (event) => {
        const { pageX, pageY } = event;
        const canvasCoordinates = [
            pageX - Utils.canvasOffsetLeft,
            pageY - Utils.canvasOffsetTop,
        ];
        return Utils.unmapArrayCoord(canvasCoordinates);
    };

    const mouseMoveHandler = (event) => {
        if (containerRef && containerRef.current && Utils.ready) {
            const mapCoordinates = getMapCoordinatesFromMouseEvent(event);
            if (onMouseMove) {
                onMouseMove(mapCoordinates);
            }
            const curHoveredComponent = ComponentFinder.findComponent(
                mapCoordinates,
                mapData,
                curPointerRadius,
                [curPointerComponentId]
            );
            if (
                (hoveredComponent ? hoveredComponent.id : hoveredComponent) !==
                (curHoveredComponent
                    ? curHoveredComponent.id
                    : curHoveredComponent)
            ) {
                setHoveredComponent(curHoveredComponent);
                if (onHoverComponentChanged) {
                    onHoverComponentChanged(curHoveredComponent);
                }
            }
        }
    };

    const mouseDownHandler = (event) => {
        if (containerRef && containerRef.current && Utils.ready) {
            const mapCoordinates = getMapCoordinatesFromMouseEvent(event);

            if (onMouseDown) {
                onMouseDown(mapCoordinates);
            }

            if (hoveredComponent && selectedComponent !== hoveredComponent) {
                setSelectedComponent(hoveredComponent);
                if (onSelectComponentChange) {
                    onSelectComponentChange(hoveredComponent);
                }
            }
        }
    };

    return (
        <div
            style={{
                cursor: cursorStyle
                    ? cursorStyle
                    : hoveredComponent
                    ? 'pointer'
                    : 'move',
            }}
        >
            <SelectedDisplay
                componentData={hoveredComponent || selectedComponent}
            />
            <div
                onMouseMove={mouseMoveHandler}
                onMouseDown={mouseDownHandler}
                ref={containerRef}
            >
                <Map mapData={mapData} canvasHeightPercentage={0.8} />
            </div>
        </div>
    );
}
