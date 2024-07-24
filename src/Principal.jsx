import React from 'react';
import MainPage from './components/MainPage';
import NavBar from './components/NavBar';
import FooterComp from "./components/FooterComp";



export function Principal() {
  return (
    <div>
      <NavBar/>
      <MainPage />
      <FooterComp/>
    </div>
  );
}
export default Principal;
