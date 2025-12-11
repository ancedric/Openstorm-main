import './addProduct/style.css'
import { useState } from 'react'
import api from '../../axiosConfig';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const RemoveProductForm = ({products, close, onProductRemoved}) => {
    const [productToRemoveData, setProductToRemoveData] = useState(null);
    
      const changeRemove = (e) => {
        if (e && e.target) {
          const productId = e.target.value;
          setProductToRemoveData(productId);
        }
      };

      const handleProductRemove = async (e) => {
          e.preventDefault()
          
          try {
            const newProduct = await api.delete(`/products/delete-product/${productToRemoveData}`, {
              headers: { }
            });
            if (newProduct) {
              onProductRemoved(productToRemoveData);
              close()
            }
          }catch(err){ 
            console.error(err)
          }
        };
  return (
    <div className="pop slide-up-2">
          <h3>Remove Product</h3>
            <div className="product-form">
              <form onSubmit={handleProductRemove} id="product-remove-form">
                <div className="form-group dash">
                  <label htmlFor="productId">Select product to remove</label>
                  <select
                    id="productId"
                    name="productToRemove"
                    onChange={changeRemove}
                  >
                    **<option value="" disabled selected>Select a product</option>**
                    {products.map((product) => (
                      <option value={product.id} key={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group dash">
                  <button type="submit">Remove product</button>
                </div>
              </form>
              
              <button className="close-btn" onClick={close}>
                <img
                  src="frontend\src\assets\icons\close-square-svgrepo-com.svg"
                  alt="close"
                  width="35px"
                />
              </button>
          </div>
        </div>
  )
}
RemoveProductForm.propTypes = {
  products: PropTypes.shape.isRequired,
  close: PropTypes.func.isRequired,
  onProductRemoved: PropTypes.func.isRequired
}
export default RemoveProductForm