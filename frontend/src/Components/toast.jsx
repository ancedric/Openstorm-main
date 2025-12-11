import PropTypes from 'prop-types'
function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`} onClick={onClose}>
      {message}
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Toast;