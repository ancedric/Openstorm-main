
import PropTypes from 'prop-types'
import Loader from '../Loader'
import { baseURL } from '../../axiosConfig'
import './productView.css'

const ProductViewCard = ({product, close}) => {
  return (
    <div>
               {!product? (<Loader />) : 
               (<div className="product-view">
                <button className="close-btn" onClick={close}>
                   <img
                    src="frontend\src\assets\icons\close-square-svgrepo-com.svg"
                    alt="close"
                    width="35px"
                  />
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
                        {/*<div className="command-product">
                          <button onClick={()=> navigate(`/view-shop/${product.shopId}`)}>Back to Command</button>
                        </div>*/}
                        <p className="data"> Summary : <br /> {product.summary}</p>
                        <p className="description"> <b>Description :</b><br /> {product.description}</p>
                        <p className="data"> Supplier : {product.supplier}</p>
                        {/*<p className="data"> Added At : {product.createdat.toString().split('T')[0]}</p>*/}
                      </div>
                    </div>
                  </div>
                </div>)
              }
    </div>
  )
}
ProductViewCard.propTypes = {
  product: PropTypes.shape.isRequired,
  close: PropTypes.func.isRequired,
}
export default ProductViewCard