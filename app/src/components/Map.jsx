import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import MapRenderer from '../renderers/MapRenderer';
import Utils from '../Utils';

export default function Map({ mapData, canvasHeightPercentage = 0.9 }) {
    const canvasRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.9);
    const [canvasHeight, setCanvasHeight] = useState(
        window.innerHeight * canvasHeightPercentage
    );
    const [canvasProps, setCanvasProps] = useState({
        centerX: 0,
        centerY: 0,
        zoom: 0.5,
    });

    const [draging, setDraging] = useState(false);
    const lastDragCoord = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.addEventListener('wheel', onZoom, {
                passive: false,
            });
            return () => {
                canvasRef.current.removeEventListener('wheel', onZoom);
            };
        }
    }, [canvasRef]);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            Utils.initUtils(
                canvasProps,
                canvasWidth,
                canvasHeight,
                canvasRef.current.offsetLeft,
                canvasRef.current.offsetTop
            );
        }
    }, [canvasWidth, canvasHeight, canvasProps, canvasRef]);

    useEffect(() => {
        if (mapData && canvasRef && canvasRef.current) {
            const canvasObj = canvasRef.current;
            const ctx = canvasObj.getContext('2d');
            MapRenderer.render(ctx, mapData, canvasWidth, canvasHeight);
        }
    }, [canvasRef, canvasProps, mapData, canvasWidth, canvasHeight]);

    const onDragStart = (event) => {
        event.preventDefault();
        if (mapData) {
            setDraging(true);
            lastDragCoord.current = {
                x: event.screenX,
                y: event.screenY,
            };
        }
    };

    const onDragEnd = (event) => {
        setDraging(false);
        lastDragCoord.current = null;
    };

    const onDragMove = (event) => {
        if (draging) {
            const lastCoord = {
                x: lastDragCoord.current.x,
                y: lastDragCoord.current.y,
            };
            const curCoord = {
                x: event.screenX,
                y: event.screenY,
            };

            setCanvasProps((prevCanvasProps) => ({
                ...prevCanvasProps,
                centerX: prevCanvasProps.centerX - (curCoord.x - lastCoord.x),
                centerY: prevCanvasProps.centerY - (curCoord.y - lastCoord.y),
            }));
            lastDragCoord.current = curCoord;
        }
    };

    const onZoom = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (mapData) {
            const { pageX, pageY, deltaY } = event;

            const ZOOM_FACTOR = 1.25;
            let curZoomFactor = 1;
            if (deltaY > 0) {
                // zoom out
                curZoomFactor = 1 / ZOOM_FACTOR;
            } else if (deltaY < 0) {
                // zoom in
                curZoomFactor = ZOOM_FACTOR;
            }

            setCanvasProps((prevCanvasProps) => {
                const zoomCenterInCanvasView = {
                    x: pageX - canvasRef.current.offsetLeft,
                    y: pageY - canvasRef.current.offsetTop,
                };

                const zoomOffsetFromViewCentre = {
                    x: zoomCenterInCanvasView.x - canvasWidth / 2,
                    y: zoomCenterInCanvasView.y - canvasHeight / 2,
                };

                const zoomCenterInCanvas = {
                    x: zoomOffsetFromViewCentre.x + prevCanvasProps.centerX,
                    y: zoomOffsetFromViewCentre.y + prevCanvasProps.centerY,
                };

                return {
                    centerX:
                        prevCanvasProps.centerX -
                        zoomCenterInCanvas.x * (1 - curZoomFactor),
                    centerY:
                        prevCanvasProps.centerY -
                        zoomCenterInCanvas.y * (1 - curZoomFactor),
                    zoom: prevCanvasProps.zoom * curZoomFactor,
                };
            });
        }
        return false;
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: 20,
            }}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={onDragStart}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                onMouseMove={onDragMove}
            />
        </div>
    );
}
