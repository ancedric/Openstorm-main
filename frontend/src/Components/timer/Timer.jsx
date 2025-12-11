import './style.css'
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Timer = ({shop}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentLocalTime = new Date().toLocaleTimeString(undefined, { timeZone: 'UTC'});
      setCurrentTime(currentLocalTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const closeTime = shop && shop.closehour;
  const openTime = shop && shop.openinghour;

  const isOpen = () => {
    if (currentTime && closeTime && openTime) {
      const currentTimeParts = currentTime.split(':');
      const openTimeParts = openTime.split(':');
      const closeTimeParts = closeTime.split(':');

      const currentSeconds = parseInt(currentTimeParts[0]) * 3600 + parseInt(currentTimeParts[1]) * 60 + parseInt(currentTimeParts[2]);
      const openSeconds = parseInt(openTimeParts[0]) * 3600 + parseInt(openTimeParts[1]) * 60 + parseInt(openTimeParts[2]);
      const closeSeconds = parseInt(closeTimeParts[0]) * 3600 + parseInt(closeTimeParts[1]) * 60 + parseInt(closeTimeParts[2]);

      return currentSeconds >= openSeconds && currentSeconds <= closeSeconds;
    }
    return false;
  };

  return (
    <div className={`clock ${isOpen() ? 'open' : 'closed'}`}>
      {currentTime} <p className={`clock ${!isOpen() ? 'isClosed' : 'isOpen'}`}>{!isOpen() ? 'closed' : 'open'}</p>
    </div>
  );
};

Timer.propTypes = {
  shop : PropTypes.shape({
    id: PropTypes.number.isRequired,
    openinghour: PropTypes.string.isRequired,
    closehour: PropTypes.string.isRequired,
  }).isRequired,
}

export default Timer;