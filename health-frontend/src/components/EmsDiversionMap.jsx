import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const EmsDiversionMap = ({ hospitals = [], predictions = {}, selectedType = 'O_neg' }) => {
  const center = [12.9716, 77.5946];

  const connections = useMemo(() => {
    const lines = [];
    if (!hospitals || hospitals.length < 5) return lines;

    hospitals.slice(0, 45).forEach((h, i) => {
      if (!h.location) return;
      const hPos = h.location.split(',').map(Number);

      const neighbors = hospitals
        .slice(0, 55)
        .map((target, idx) => {
          if (i === idx || !target.location) return { d: Infinity };
          const tPos = target.location.split(',').map(Number);
          return { d: Math.hypot(hPos[0]-tPos[0], hPos[1]-tPos[1]), pos: tPos };
        })
        .sort((a,b) => a.d - b.d).slice(0, 2);

      neighbors.forEach(n => { if(n.pos) lines.push([hPos, n.pos]); });
    });
    return lines;
  }, [hospitals]);

  return (
    <div style={{ height: '100%', width: '100%', background: '#f8f9fa' }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* SUBTLE GRAY MESH LINES */}
        {connections.map((line, i) => (
          <Polyline
            key={`mesh-${i}`}
            positions={line}
            pathOptions={{ color: '#000000', weight: 1, opacity: 0.1 }}
          />
        ))}

        {/* STRICT BLACK AND RED NODES */}
        {hospitals.map((h, i) => {
          if (!h.location) return null;

          const pos = h.location.split(',').map(num => parseFloat(num.trim()));
          if (isNaN(pos[0]) || isNaN(pos[1])) return null;

          const nodeData = predictions?.[h.id]?.[selectedType];
          const isCrit = nodeData ? nodeData.is_critical : (h[selectedType] < 15);

          return (
            <CircleMarker
              key={h.id || i}
              center={pos}
              radius={isCrit ? 9 : 6}
              pathOptions={{
                fillColor: isCrit ? '#dc2626' : '#000000', // RED or BLACK only
                color: '#ffffff',
                weight: 2,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="px-2 py-1 min-w-[140px]">
                  <p className="text-xs font-black text-black border-b border-neutral-200 pb-2 mb-2 uppercase">{h.name}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Stock</span>
                    <span className={`text-sm font-black ${isCrit ? 'text-red-600' : 'text-black'}`}>{h[selectedType] || 0} U</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EmsDiversionMap;