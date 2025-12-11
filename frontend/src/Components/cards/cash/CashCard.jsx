import './style.css'
import PropTypes from "prop-types";
import { useState } from "react";
import { baseURL } from "../../../axiosConfig";

const CashCard = ({product, shop, add, setViewProduct}) => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    console.log('Product stock: ', product.stock)
    const setOverlay = () => {
        setIsOverlayVisible(true);
    };
    
    const unsetOverlay = () => {
        setIsOverlayVisible(false);
    };

    return (
        <div className="cash-card-ctn">
        <div
            className="prod-img"
            onMouseEnter={setOverlay}
            onMouseLeave={unsetOverlay}
        >
            <img
                src={product.image}
                alt={product.name}
                className={`${isOverlayVisible ? "zoom" : ""}`}
                style={{ width: "100%" }}
            />
            {isOverlayVisible && (
                <div className="img-overlay">
                    <button className="view-btn" onClick={() => setViewProduct(product.id)}> View product </button>
                </div>
            )}
            {product.status !== "none" && (
                <div
                    className="prod-status"
                    style={{
                        backgroundColor: product.stock === 0 ? "#ff0101" : product.stock < 10 ? "#ff9901ff" :"#2ff72f",
                        color: "#fff",
                    }}
                >
                    <p>{product.stock === 0 ? 'Out of order' : product.stock < 10 ? 'Low Stock' : 'In stock'}</p>
                </div>
            )}
        </div>
        <div className="prod-infos">
            <div className="prod-title">    
                <h5 className="product-title">{product.name.toUpperCase()}</h5>
            </div>
            <p>{product.ref}</p>
            <>
                <div className="price-data">
                    <p className="price">Price: {product.price} $</p>
                    {product.reduction > 0 && (
                    <p className="reduction-rate">-Remise: {product.reduction}%</p>
                )}
                </div>
                <div className="btn-div">
                    <button
                        onClick={() => add(product, shop.id)}
                        className="green-submit-btn"
                        disabled={product.stock===0}
                    >
                        Add
                    </button>
                </div>
            </>
        </div>
        </div>
    );
}

    CashCard.propTypes = {
        product: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            supplier: PropTypes.string,
            summary: PropTypes.string,
            description: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            reduction: PropTypes.number,
            likes: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
            stock: PropTypes.number.isRequired,
            deliveryMode: PropTypes.string,
            image: PropTypes.string.isRequired,
        }).isRequired,
        shop: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            openingHour: PropTypes.string,
            closeHour: PropTypes.string,
            image: PropTypes.string,
        }),
        add: PropTypes.func.isRequired,
        setViewProduct: PropTypes.func.isRequired
    };

export default CashCard