import './style.css'
import PropTypes from "prop-types"
import { baseURL } from "../../../axiosConfig"

const OrderCard = ({order}) => {
    return (
    <div className="item-ctn">
        <div className="prod-img">
            <img src={order.product.image} alt={order.product.name} />
            <h4 className="product-title">{order.product.name}</h4>
        </div>
        <div className="order-data">
            <p>Product price : {order.product.price} $</p>
            <p>Quantity : {order.quantity} items</p>
            <h4 className='order-amount'> amount - {order.total} $</h4>
        </div>
    </div>
  )
}

OrderCard.propTypes={
    order: PropTypes.shape.isRequired
}

export default OrderCard

OrderCard.propTypes = {
  order: PropTypes.shape.isRequired
}