import './style.css'
import PropTypes from "prop-types";


const CartCard = ({product, quantity, remove, updateQuantity}) => {
    
        const unitPrice = product.price;

        const finalPrice = unitPrice * quantity * (1 - (product.reduction || 0) / 100)

        const increaseQuantity = () => {
            updateQuantity(product.id, quantity + 1); 
        }
        const decreaseQuantity = () => {
            const newQty = quantity > 1 ? quantity - 1 : 1;
            updateQuantity(product.id, newQty);
        }

        const handleRemove = () => {
            remove(product.id)
        }
    return (
        <div className="cart-card-ctn">
            <div
                className="img-product"
            >
                <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%" }}
                />
            </div>
            <div className="infos-product">
                <div className="prod-title">
                    <h5 className="product-title">{product.name.toUpperCase()}</h5>
                </div>
                <div className="price-data">
                        <p className="price">Price: {finalPrice.toFixed(2)} $</p>
                        {product.reduction !== undefined && product.reduction !== 0 && (
                        <p className="reduction-rate">Reduction: -{product.reduction}%</p>
                    )}
                    </div>
                    <div className="btn-div">
                        <div className="qty">
                            <button className="qtyBtn" onClick={decreaseQuantity}>{"-"}</button><p>{quantity}</p><button className="qtyBtn" onClick={increaseQuantity}>{"+"}</button>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="submit-btn"
                        >
                            Remove
                        </button>
                    </div>
            </div>
        </div>
    )}

    CartCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        ref: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        supplier: PropTypes.string,
        summary: PropTypes.string,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        reduction: PropTypes.number,
        likes: PropTypes.number,
        status: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
        deliveryMode: PropTypes.string,
        image: PropTypes.string.isRequired,
    }).isRequired,
    quantity: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    };
export default CartCard