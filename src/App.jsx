import React from 'react';
import ChatComponent from './components/ChatComponent';
import NavBar from './components/NavBar';
import FooterComp from "./components/FooterComp";
export function App() {
  return (
    <>
      <NavBar/>
      <ChatComponent/>
      <FooterComp/>
    </>
  );
}
export default App;
