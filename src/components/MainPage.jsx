import React from 'react';
import './MainPage.css';
function MainPage() {
  
  return (
    <div id="inicio">
      <header>
      <div className="container">
        <div className="title">
          <h1 id="main-title">LUC-A</h1>
          <p id="subtitle">Asistente Médico</p>
        </div>
      </div>
      </header>
      <div className="main-content">
      <div className="profile-container luc-a-Info">
        <img src="src\imgs\logo.jpeg" alt="Logo Luc-A" />
        <div className="profile-text">
          <h2>¡Hola! Soy Luc-A</h2>
          <p>Chatbot con inteligencia artificial diseñado para proporcionar asistencia médica personalizada. Mi objetivo principal es ofrecer a los usuarios un pre diagnóstico basado en los síntomas que describen, brindando orientación sobre el tipo de especialista que podrían necesitar consultar.</p>
        </div>
      </div>
      <div className="main-content-white">
        <div className="profile-container-white">
          <div className="profile-text-white">
            <h2>Nuestro Equipo</h2>
            <p>Equipo de 10 estudiantes de la escuela de programacion ProA Técnica San Francisco. Aplicamos nuestros conocimientos para crear herramientas que impacten positivamente en la comunidad, inspirados por nuestro compromiso con la excelencia y el progreso.</p>
          </div>
          <div className="image-rectangle">
            <img src="src\imgs\nosotros.jpeg" alt="Nuestro Equipo" id="profile-image" />
          </div>
  </div>
</div>

      </div>
    </div>
  );
}
export default MainPage;

