import React from 'react';
import './Footer-Style.css';

const FooterComp = () => {
    return (
        <footer className="footer"> 
            <div className="footer-content">
                <div className="footer-left">
                    <h3>Robot Médico</h3>
                    <p> Optimiza tu salud con Luc-A: tecnología avanzada al servicio de tu bienestar y seguridad.
                    </p>
                </div>
                <div className="footer-center">
                    <h3>Enlaces útiles</h3>
                    <ul className="footer-links">
                        <li><a href="">Inicio</a></li>
                        <li><a href="Chatbot.html">Chat</a></li>
                        <li><a href="Map.html">Mapa</a></li>
                    </ul>
                </div>
                <div className="footer-right">
                    <h3>Escuela ProA Técnica</h3>
                    <p><i className="fa fa-map-marker"></i> Las Guayanas 533, San Francisco, Córdoba, Argentina</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Robot Médico. Todos los derechos reservados.</p>
                <p>Diseñado por 7mo, ProA Técnica, San Francisco (2024)</p>
            </div>
        </footer>
    );
};
export default FooterComp;
