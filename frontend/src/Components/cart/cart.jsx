import './style.css'
import propTypes from 'prop-types'
import CartCard from '../cards/cart/CartCard'

const Cart = ({products, remove, updateQuantity}) => {
  const list = products || []


  return (
    <div className="cart-div">
        {list.length === 0 ? (
            <div className="empty">Your cart is empty</div>
        ) : (
        <div className='cart-ctn'>
            {list.map((com) => (
                <CartCard key={com.product.id} product={com.product} quantity={com.quantity} remove={remove} updateQuantity={updateQuantity}/>
            ))}
        </div>)}
    </div>
  )
}
Cart.propTypes = {
  products: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
      name: propTypes.string.isRequired,
      price: propTypes.number.isRequired,
      quantity: propTypes.number.isRequired,
      shop: propTypes.string.isRequired,
      status: propTypes.string.isRequired,
      productImage: propTypes.string.isRequired,
    })
  ),
  remove: propTypes.func.isRequired,
  updateQuantity: propTypes.func.isRequired,
};

export default Cart