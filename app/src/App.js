import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        const updateMapDataListener = (data) => {
            setMapData(data);
        };
        socket.on('update-map-data', updateMapDataListener);
        return () => {
            socket.off('update-map-data', updateMapDataListener);
        };
    }, []);

    return (
        <div className="App">
            {mapData ? (
                <Map mapData={mapData} />
            ) : (
                <div>Loading map data...</div>
            )}
        </div>
    );
}

export default App;
