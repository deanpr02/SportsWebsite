import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({lat,lon}){
    return (
        <MapContainer 
            center={[lat,lon]} 
            zoom={8} 
            style={{ height: "50vh", width: "50vh" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[lat,lon]}>
                <Popup>
                    Your popup content here
                </Popup>
            </Marker>
        </MapContainer>
    );
};
