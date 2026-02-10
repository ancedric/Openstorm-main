import './addProduct/style.css'
import { useState } from 'react'
import supabase from '../../supabase.config';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const RemoveProductForm = ({products, close, onProductRemoved}) => {
    const [productToRemoveData, setProductToRemoveData] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false)
    
      const changeRemove = (e) => {
        if (e && e.target) {
          const productId = e.target.value;
          setProductToRemoveData(productId);
        }
      };

      const handleProductRemove = async (e) => {
          e.preventDefault()
          setIsRemoving(true)
          try {
            console.log("produit à supprimer: ", productToRemoveData)
            const {data, error} = await supabase
            .from('inventory_products')
            .delete()
            .eq('ref', productToRemoveData)
            .select()
            if(error){
              console.log('Error removing product:', error)
              setIsRemoving(false)
            }
            const newProduct = data
            if (newProduct) {
              onProductRemoved(productToRemoveData);
              setIsRemoving(false)
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
                      <option value={product.ref} key={product.ref}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group dash">
                  <button type="submit" disabled={isRemoving}>{isRemoving? 'Removing...' : 'Remove product'}</button>
                </div>
              </form>
              
              <button className="close-btn" onClick={close}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#54129b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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