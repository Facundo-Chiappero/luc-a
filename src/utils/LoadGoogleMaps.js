export function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
      if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        resolve(window.google.maps);
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Error loading Google Maps script'));
  
      window.initMap = () => {
        if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
          resolve(window.google.maps);
          delete window.initMap;
        } else {
          reject(new Error('Google Maps API not available'));
        }
      };
  
      document.head.appendChild(script);
    });
  }
  