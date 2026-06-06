import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { getCoordinates } from '../utils/geocoding.js';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const COLORS = {
  funding: '#FFD700',
  scholarship: '#4FC3F7',
  community: '#CE93D8',
  education: '#A5D6A7',
  social: '#F48FB1',
  event: '#FFAB40',
};

const HK_CENTER = [22.3193, 114.1694];
const INITIAL_ZOOM = 12;

function createCategoryIcon(category) {
  const color = COLORS[category] || COLORS.community;
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="marker-pin" style="background: ${color}; box-shadow: 0 0 12px ${color}">
        <div class="marker-core"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function MarkersLayer({ nodes }) {
  const map = useMap();
  const clusterGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="marker-cluster-custom">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
        });
      }
    });

    nodes.forEach(node => {
      const coords = getCoordinates(node.name);
      const marker = L.marker([coords.lat, coords.lng], {
        icon: createCategoryIcon(node.category)
      });

      const popupContent = `
        <div class="map-popup">
          <div class="map-popup-name" style="color: ${COLORS[node.category] || COLORS.community}">
            ${node.name}
          </div>
          <div class="map-popup-cat" style="color: ${COLORS[node.category] || COLORS.community}">
            ${node.category}
          </div>
          <div class="map-popup-reason">
            ${node.reason}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);
    clusterGroupRef.current = markerClusterGroup;

    if (nodes.length > 0) {
      const bounds = L.latLngBounds(
        nodes.map(node => {
          const coords = getCoordinates(node.name);
          return [coords.lat, coords.lng];
        })
      );

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 0.8,
      });
    } else {
      map.setView(HK_CENTER, INITIAL_ZOOM);
    }

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map, nodes]);

  return null;
}

export default function MapView({ nodes }) {
  return (
    <div className="map-container">
      {nodes.length === 0 && (
        <div className="map-empty-hint">
          <p>Start a conversation to discover Hong Kong opportunities</p>
        </div>
      )}
      <MapContainer
        center={HK_CENTER}
        zoom={INITIAL_ZOOM}
        minZoom={11}
        maxZoom={18}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <MarkersLayer nodes={nodes} />
      </MapContainer>
    </div>
  );
}
