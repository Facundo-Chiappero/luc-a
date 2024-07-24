import React from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import NavBar from './components/NavBar';
import FooterComp from "./components/FooterComp";



export function Map() {
  return (
    <div>
      <NavBar/>
      <GoogleMapComponent />
      <FooterComp/>
    </div>
  );
}
export default Map;
