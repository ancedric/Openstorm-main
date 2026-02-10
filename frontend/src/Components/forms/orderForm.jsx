import PropTypes from "prop-types";
import { useState } from "react";
import supabase from "../../supabase.config";
import Toast from '../toast';
import './orderForm.css'

const OrderForm = ({ productId, currentQty, updateStock, onClick }) => {
  const [newQuantity, setQuantity] = useState(0);
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
      console.log("Données à envoyer: ", productId, newQuantity)

      const {data, error} = await supabase
      .from('inventory_products')
      .update({stock: newQuantity})
      .eq('id', productId)
      .select()

      if (data) {
        console.log('response: ', data)
          updateStock(newQuantity)
          onClick()
        }
        else {
        console.error("Erreur lors de la mise à jour du stock", error);
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
    <div className="order-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              onChange={handleQuantityChange}
              value={newQuantity || ""}
            />
          </div>
          <div className="buttons">
            <input
              type="submit"
              className="submit-btn"
              value="Save"
            />
            <button type="button" className="left-arrow-btn" onClick={onClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#eee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>
        </form>
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
