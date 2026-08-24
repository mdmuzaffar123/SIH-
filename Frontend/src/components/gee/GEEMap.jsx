import { useEffect, useState } from 'react';
import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Droplets, Layers, Leaf, LoaderCircle, Map as MapIcon, Moon, Sun, Thermometer } from 'lucide-react';
import { getBoundary, getGeeMap } from '../../services/geeApi';
import 'leaflet/dist/leaflet.css';
import AnalysisPanel from './AnalysisPanel';

const layers = [
  { id: 'satellite', label: 'Satellite', icon: MapIcon },
  { id: 'solar', label: 'Solar', icon: Sun },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'nightlights', label: 'Night Lights', icon: Moon },
  { id: 'vegetation', label: 'Vegetation', icon: Leaf },
  { id: 'temperature', label: 'Temperature', icon: Thermometer },
];

function MapView({ center }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, 8, { duration: 0.8 }); }, [center, map]);
  return null;
}

export default function GEEMap({ location }) {
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [mapData, setMapData] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const center = location.coordinates;

  useEffect(() => {
    const controller = new AbortController();
    setMapLoading(true); setMapError('');
    Promise.all([getGeeMap(location.name, activeLayer, controller.signal), getBoundary(location.name, location.state, controller.signal)])
      .then(([layer, geojson]) => { setMapData(layer); setBoundary(geojson); })
      .catch((error) => { if (error.name !== 'AbortError') setMapError('Unable to load this map layer.'); })
      .finally(() => { if (!controller.signal.aborted) setMapLoading(false); });
    return () => controller.abort();
  }, [activeLayer, location.name, location.state]);

  const legend = mapData?.legend || [];
  return <section className="gee-section gee-container gee-map-section"><div className="gee-heading"><div><div className="gee-section-kicker">EARTH OBSERVATION LAYER</div><h2>Satellite Intelligence Map</h2></div><div className="gee-map-legend">{legend.map((item) => <span key={`${item.label}-${item.value}`}><i className="legend-dot solar-dot" /> {item.label}: {item.value}</span>)}</div></div><div className="gee-map-layout"><div className="gee-map-card"><div className="gee-map-toolbar"><Layers size={16} /><span>Analysis layer</span>{layers.map(({ id, label, icon: Icon }) => <button type="button" aria-label={`Show ${label} layer`} className={activeLayer === id ? 'active' : ''} onClick={() => setActiveLayer(id)} key={id}><Icon size={14} />{label}</button>)}</div><div className="gee-map-canvas">{mapLoading && <div className="gee-map-loading" role="status"><LoaderCircle className="gee-spin" size={24} /><span>Loading {activeLayer} layer...</span></div>}{mapError && <div className="gee-map-error">{mapError}</div>}<MapContainer center={center} zoom={8} scrollWheelZoom className="gee-leaflet-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url={mapData?.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} /><MapView center={center} />{boundary && <GeoJSON data={boundary} pathOptions={{ color: '#16a34a', fillColor: '#22c55e', fillOpacity: .16, weight: 2 }} />}<Circle center={center} radius={9000} pathOptions={{ color: '#f59e0b', fillColor: '#facc15', fillOpacity: .22, weight: 2 }} /><Marker position={center}><Popup><strong>{location.name}</strong><br />District: {location.name}<br />State: {location.state}</Popup></Marker></MapContainer><div className="gee-map-label"><span className="gee-pulse" />{location.name} district boundary</div></div></div><AnalysisPanel location={location} /></div></section>;
}
