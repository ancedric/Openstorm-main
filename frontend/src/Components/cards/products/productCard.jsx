import './style.css'
import PropTypes from "prop-types";
import { useState } from "react";
import OrderForm from "../../forms/orderForm";
import { baseURL } from "../../../axiosConfig";

const ProductCard = ({ viewProduct, product }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [commandFormOpen, setCommandFormOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [stock, setStock]= useState(product.stock)

  const handleOpenCommand = (productId) => {
    setSelectedProductId(productId);
    setCommandFormOpen(true);
  }

  const openViewProduct =() =>{
    viewProduct(product.id)
  }
  const handleCloseCommand = () => {
    setCommandFormOpen(false);
  };
  const setupStock = (newStock) => {
    setStock(newStock)
  }

  const setOverlay = () => {
    setIsOverlayVisible(true);
  };

  const unsetOverlay = () => {
    setIsOverlayVisible(false);
  };
  return (
    <div className="command cat-item carousel-item">
      <div
        className="prod-img"
        onMouseEnter={setOverlay}
        onMouseLeave={unsetOverlay}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`${isOverlayVisible ? "zoom" : ""}`}
        />
        {isOverlayVisible && (
          <div className="img-overlay">
            <button className="view-btn" onClick={openViewProduct}> View product </button>
          </div>
        )}
        {product.status !== "none" && (
          <div
            className="prod-status"
            style={{
              backgroundColor: stock === 0 ? "#ff0101" : stock < 10 ? "#ff9901ff" : "#2ff72f",
              color: "#fff",
            }}
          >
            <p>{stock === 0 ? 'Out of order' : stock < 10 ? 'Low Stock' : 'In Stock'}</p>
          </div>
        )}
      </div>
      <div className="prod-infos">
        <div className="prod-title">
          <h5 className="product-title">{product.name.toUpperCase()}</h5>
        </div>
        {commandFormOpen && product.id === selectedProductId ? (
          <div className="slide-form-left">
            <OrderForm
              productId={product.id}
              currentQty={product.stock}
              updateStock={setupStock}
              onClick={handleCloseCommand}
            />
          </div>
        ) : (
          <div className="infos-data">
            <div className="prod-desc">
              <h5>Category: {product.category}</h5>
              <p className="product-description">{product.summary}</p>
            </div>
            <div className="price-data">
              <p className="price">Price: {product.price} $</p>
              {product.reduction > 0 && (
                <p className="reduction-rate">Reduction: -{product.reduction}%</p>
              )}
              <p className="reduction-rate">Stock: {stock} Items</p>
            </div>
            <div className="btn-div"> 
                <button
                  onClick={() => handleOpenCommand(product.id)}
                  className="green-submit-btn"
                >
                  Add Stock
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  viewProduct: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    supplier: PropTypes.string,
    summary: PropTypes.string,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    reduction: PropTypes.number,
    status: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  shop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    openingHour: PropTypes.string,
    closeHour: PropTypes.string,
    image: PropTypes.string,
  })
};

export default ProductCard;
