import './style.css'
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({ shop }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      // On stocke l'objet Date complet pour faciliter les calculs
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const closeTime = shop && shop.closehour;
  const openTime = shop && shop.openinghour;

  const isOpen = () => {
    if (currentTime && closeTime && openTime) {
      // 1. Obtenir les secondes totales pour l'heure locale actuelle
      const currentSeconds = 
        currentTime.getHours() * 3600 + 
        currentTime.getMinutes() * 60 + 
        currentTime.getSeconds();

      // 2. Parser les heures de la boutique (format attendu "HH:mm:ss")
      const openParts = openTime.split(':').map(Number);
      const closeParts = closeTime.split(':').map(Number);

      const openSeconds = openParts[0] * 3600 + openParts[1] * 60 + (openParts[2] || 0);
      const closeSeconds = closeParts[0] * 3600 + closeParts[1] * 60 + (closeParts[2] || 0);

      // 3. Comparaison simple
      return currentSeconds >= openSeconds && currentSeconds <= closeSeconds;
    }
    return false;
  };

  return (
    <div className={`clock ${isOpen() ? 'open' : 'closed'}`}>
      {/* Affichage de l'heure locale formatée */}
      {currentTime.toLocaleTimeString()} 
      <p className={`clock ${!isOpen() ? 'isClosed' : 'isOpen'}`}>
        {!isOpen() ? 'closed' : 'open'}
      </p>
    </div>
  );
};

Timer.propTypes = {
  shop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    openinghour: PropTypes.string.isRequired,
    closehour: PropTypes.string.isRequired,
  }).isRequired,
}

export default Timer;