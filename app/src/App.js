import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import MapBuilder from './components/MapBuilder';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const STATE_LIST = {
    VIEW_MAP: 'view_map',
    CREATE_MAP: 'create_map',
};

function App() {
    const [mapData, setMapData] = useState(null);
    const [curState, setCurState] = useState(STATE_LIST.CREATE_MAP);

    useEffect(() => {
        const updateMapDataListener = (data) => {
            setMapData(data);
        };
        socket.on('update-map-data', updateMapDataListener);
        return () => {
            socket.off('update-map-data', updateMapDataListener);
        };
    }, []);

    let Content;
    if (curState === STATE_LIST.VIEW_MAP) {
        if (mapData) {
            Content = <Map mapData={mapData} />;
        } else {
            Content = <div>Loading map data...</div>;
        }
    } else if (curState === STATE_LIST.CREATE_MAP) {
        Content = <MapBuilder />;
    }

    return <div className="App">{Content}</div>;
}

export default App;
