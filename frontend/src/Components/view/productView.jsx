
import PropTypes from 'prop-types'
import './productView.css'

const ProductViewCard = ({product, close}) => {
  return (
          <div className="overlay" onClick={close}>
            <div>
               {!product? (<div className="product-view" onClick={close}>
                Aucun produit pour le moment
              </div>) : 
               (<div className="product-view">
                <button className="close-btn" onClick={close}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#54129b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                  <div className='card'>
                    <div className="product-img">
                      <img src={product.image} alt="" />
                      <div className="img-declination"></div>
                    </div>
                    <div className="product-title">
                      <h3>{product.name.toUpperCase()}</h3>
                    </div>
                    <div className="product-info">
                      <div className="left">
                        <div className='caption'>
                          <p className="price"> Price : {product.price} $</p>
                          <p className="category"> Category : {product.category}</p>
                        </div>
                        <p className="data"> Summary : <br /> {product.summary}</p>
                        <p className="description"> <b>Description :</b><br /> {product.description}</p>
                        <p className="data"> Supplier : {product.supplier}</p>
                      </div>
                    </div>
                  </div>
                </div>)
              }
            </div>
          </div>
          
          
  )
}
ProductViewCard.propTypes = {
  product: PropTypes.shape.isRequired,
  close: PropTypes.func.isRequired,
}
export default ProductViewCard