import './addProduct/style.css'
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../axiosConfig";
import Toast from '../toast';

const OrderForm = ({ productId, currentQty, updateStock, onClick }) => {
  const [quantity, setQuantity] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const handleQuantityChange = (event) => {
    let _quantity = parseInt(event.target.value);
    if (_quantity <= 0) {
      _quantity = 0;
      setQuantity(currentQty + 0);
    }else
      setQuantity(currentQty + _quantity)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Données à envoyer: ", productId, quantity)
      const res = await api.put(`/products/upgrade-stock/${productId}`, {quantity: quantity});

      if (res.status === 201) {
        console.log('response: ', res)
          updateStock(quantity)
          onClick()
        }
        else {
        console.error("Erreur lors de la mise à jour du stock");
          setToast({ message: 'Erreur lors de la mise à jour du stock', type: 'error', visible: true });
          setTimeout(() => {
            setToast({ ...toast, visible: false });
          }, 3000);
      }
    } catch (error) {
      console.error("Une erreur s'est produite:", error);
    }
  };

  return (
    <div className="order-form" style={{height:'200px'}}>
      <div>
        <h4>Add product stock</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              onChange={handleQuantityChange}
              value={quantity || ""}
            />
          </div>
          <div className="buttons">
            <input
              type="submit"
              className="green-submit-btn"
              value="Save"
            />
            <button type="button" className="red-close-btn" onClick={onClick}>
              <img
                src="\frontend\src\assets\icons\close-square-svgrepo-com.svg"
                alt="close"
                width="35px"
              />
            </button>
          </div>
        </form>
      </div>
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
    </div>
  );
};

OrderForm.propTypes = {
  productId: PropTypes.number.isRequired,
  currentQty: PropTypes.number.isRequired,
  updateStock: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default OrderForm;
