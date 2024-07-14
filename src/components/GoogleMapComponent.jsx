import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css'; // Asegúrate de importar el CSS

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const userMarkerRef = useRef(null); // Referencia para el marcador del usuario

  useEffect(() => {
    const initializeMap = () => {
      if (!map) {
        const initialMap = L.map(mapRef.current).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(initialMap);
        setMap(initialMap);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setUserLocation(location);
          map.setView(location, 13);

          findNearbyPharmacies(location);
          findNearbyHealthCenters(location);
        }, () => {
          console.error('Geolocation failed or not supported.');
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const findNearbyPharmacies = (location) => {
      const [lat, lon] = location;
      const query = `[out:json];
        (
          node["amenity"="pharmacy"](around:200000, ${lat}, ${lon});
          node["amenity"="chemist"](around:200000, ${lat}, ${lon});
          node["amenity"="drugstore"](around:200000, ${lat}, ${lon});
          node["amenity"="health_food"](around:200000, ${lat}, ${lon});
          node["shop"="pharmacy"](around:200000, ${lat}, ${lon});
        );
        out body;`;

      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Para depuración
          data.elements.forEach((pharmacy) => {
            const pharmacyLocation = [pharmacy.lat, pharmacy.lon];
            L.marker(pharmacyLocation).addTo(map)
              .bindPopup(`<b>${pharmacy.tags.name || 'Pharmacy'}</b><br>${pharmacy.tags.addr_full || ''}`);
          });
        })
        .catch(error => console.error('Error fetching pharmacies:', error));
    };

    const findNearbyHealthCenters = (location) => {
      const [lat, lon] = location;
      const query = `[out:json];
        (
          node["amenity"="Hospital"](around:200000, ${lat}, ${lon});
          node["amenity"="clinic"](around:200000, ${lat}, ${lon});
          node["amenity"="clinica"](around:200000, ${lat}, ${lon});
          node["amenity"="health_center"](around:200000, ${lat}, ${lon});
          node["amenity"="doctor"](around:20000, ${lat}, ${lon});
          node["amenity"="nursing_home"](around:200000, ${lat}, ${lon});
          node["amenity"="assistance"](around:200000, ${lat}, ${lon});
        );
        out body;`;

      fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Para depuración
          data.elements.forEach((healthCenter) => {
            const healthLocation = [healthCenter.lat, healthCenter.lon];
            L.marker(healthLocation).addTo(map)
              .bindPopup(`<b>${healthCenter.tags.name || 'Health Center'}</b><br>${healthCenter.tags.addr_full || ''}`);
          });
        })
        .catch(error => console.error('Error fetching health centers:', error));
    };

    initializeMap();
    if (map) getUserLocation();

  }, [map]);

  return (
    <div className="map-container">
      <h2 className="map-title">Farmacias y Centros de Salud</h2>
      <div className="map" ref={mapRef}></div>
    </div>
  );
};

export default MapComponent;
