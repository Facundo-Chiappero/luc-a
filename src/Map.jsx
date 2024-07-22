import React from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import NavBar from './components/NavBar';


export function Map() {
  return (
    <div>
      <NavBar/>
      <GoogleMapComponent />
    </div>
  );
}
export default Map;
