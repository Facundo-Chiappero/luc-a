import React, { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/LoadGoogleMaps';
import './MapComponent.css';

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const initializeMap = async () => {
      console.log('GoogleMapComponent mounted');
      try {
        const googleMaps = await loadGoogleMaps(apiKey);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            const map = new googleMaps.Map(mapRef.current, {
              center: userLocation,
              zoom: 12,
            });

            const service = new googleMaps.places.PlacesService(map);
            const request = {
              location: userLocation,
              radius: '5000',
              type: ['pharmacy'],
            };
            
            
            service.nearbySearch(request, (results, status) => {
              if (status === googleMaps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                  const marker = new googleMaps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                  });

                  const photos = place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200}) : null;

                  const infowindowContent = `
                    <div>
                      <strong>${place.name || 'No name available'}</strong><br>
                      ${photos ? `<br><img src="${photos}" alt="${place.name}" class="place-photo">` : ''}<br>
                      ${place.vicinity}
                    </div>
                  `;

                  const infowindow = new googleMaps.InfoWindow({
                    content: infowindowContent,
                  });

                  marker.addListener('click', () => {
                    infowindow.open(map, marker);
                  });
                });
              } else {
                console.error('PlacesService status:', status);
              }
            });
          }, (error) => {
            console.error('Geolocation error:', error);
          });
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, [apiKey]);

  return (
    <div className="map-container">
      <h2 className="map-title">Mapa de Salud</h2>
      <div className="map" ref={mapRef}></div>
    </div>
  );
};

export default GoogleMapComponent;
