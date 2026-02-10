import './style.css'
import PropTypes from 'prop-types'

const StockAlerts = ({ products, threshold = 5 }) => {
  // On filtre les produits en dessous du seuil
  const lowStockProducts = products.filter(p => p.quantity <= threshold);

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="stock-alerts-container">
      <div className="alert-header">
        <span className="alert-icon">⚠️</span>
        <h4>Critical Stock Alerts</h4>
      </div>
      <div className="alert-list">
        {lowStockProducts.map(product => (
          <div key={product.id} className="alert-item">
            <span className="product-name">{product.name}</span>
            <span className={`stock-badge ${product.quantity === 0 ? 'out' : 'low'}`}>
              {product.quantity === 0 ? 'Out of stock' : `${product.quantity} left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

StockAlerts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  threshold: PropTypes.number,
};

export default StockAlerts;