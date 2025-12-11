import './addProduct/style.css'
import { useState } from 'react'
import api from '../../axiosConfig'
import PropTypes from 'prop-types'

// eslint-disable-next-line no-unused-vars
const UpdateProductForm = ({shop, products, close, onProductUpdated}) => {

    const [productData, setProductData] = useState({
        id: '', 
        ref: '',
        shopRef: shop.ref,
        name: '',
        category: '',
        summary: '',
        description: '',
        supplier: '',
        price: '',
        image: ''
    });
    const [file, setFile] = useState(null);

    // Fonction pour gérer la SELECTION du produit
    const handleProductSelect = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

        if (selectedProduct) {
            setProductData({
                id: selectedProduct.id,
                ref: selectedProduct.ref || '', 
                shopRef: shop.ref,
                name: selectedProduct.name || '',
                category: selectedProduct.category || '',
                summary: selectedProduct.summary || '',
                description: selectedProduct.description || '',
                supplier: selectedProduct.supplier || '',
                price: selectedProduct.price.toString() || ''
            });
            setFile(null); 
        } else {
            setProductData({
                id: '',
                ref: '',
                shopRef: shop.ref,
                name: '',
                category: '',
                summary: '',
                description: '',
                supplier: '',
                price: '',
                image: ''
            });
        }
    };
    

    const handleProductUpdate = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("id", productData.id);
        formData.append("ref", productData.ref);
        formData.append("shopref", productData.shopRef);
        formData.append("name", productData.name);
        formData.append("category", productData.category);
        formData.append("summary", productData.summary);
        formData.append("description", productData.description);
        formData.append("supplier", productData.supplier);
        formData.append("price", productData.price);
        formData.append("image", file);
    
        console.log("product id", productData.id);
        console.log('Datas:', productData)

        try {
          const newProduct = await api.put(`/products/update-product/${productData.id}`,formData, {
            headers: { }
          });
        
          if (newProduct) {
            onProductUpdated(newProduct.data.product);
            close()
          }
        }catch(err){ 
          console.error(err)
        }
    }
      const changeValue = (e) => {
        if (e.target.name !== "image") {
          setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        } else {
          setFile(e.target.files[0]);
        }
      };

  return (
    <div className="pop slide-up-3">
              <h3>Update Product</h3>
                <div className="product-form">
                  <form
                    encType="multipart/form-data"
                    onSubmit={handleProductUpdate}
                    id="update-product-form"
                  >
                    <div className="form-group dash">
                      <label htmlFor="product-id">Select product to update</label>
                      <select
                        id="productId"
                        name="productId"
                        onChange={handleProductSelect}
                        value={productData.id}
                      >
                        **<option value="" disabled selected>Select a product</option>**
                        {products.map((product) => (
                          <option
                            value={product.id}
                            key={product.id}
                            style={{ height: "60px" }}
                          >
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group dash">
                  <label htmlFor="ref">Product reference</label>
                  <input
                    type="text"
                    id="ref"
                    name="ref"
                    onChange={changeValue}
                    value={productData.ref}
                    required
                  />
                  <label htmlFor="name">Product name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={changeValue}
                    value={productData.name}
                    required
                  />
                  <label htmlFor="category">Product category</label>
                  <select
                    id="category"
                    name="category"
                    onChange={changeValue}
                    value={productData.category}
                  >
                    **<option value="" disabled selected>Select a category</option>**
                    <option value="Bag">Bag</option>
                    <option value="Books">Books</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Computer">Computers</option>
                    <option value="Dishes">Dishes</option>
                    <option value="Food">Food</option>
                    <option value="Industrial material">
                      Industrial material
                    </option>
                    <option value="Jewels">Jewels</option>
                    <option value="Kitchen material">Kitchen material</option>
                    <option value="Medicines">Medicines</option>
                    <option value="Medical material">Medical Material</option>
                    <option value="Phones">Phones</option>
                    <option value="Services">Services</option>
                    <option value="School material">School material</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Sport accessories">Sport accessories</option>
                    <option value="Vehicles">Vehicles</option>
                  </select>
                  <label htmlFor="price">Product price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    onChange={changeValue}
                    value={productData.price}
                    required
                  />
                </div>
                <div className="form-group dash">
                  <label htmlFor="summary">Product descriptive summary</label>
                  <input
                    type="text"
                    id="summary"
                    name="summary"
                    onChange={changeValue}
                    value={productData.summary}
                    required
                  />
                  <label htmlFor="product-description">
                    Product description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    cols="30"
                    rows="10"
                    onChange={changeValue}
                    value={productData.description}
                  ></textarea>
                  <label htmlFor="supplier">supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    onChange={changeValue}
                    value={productData.supplier}
                  />
                </div>
                    <div className="form-group dash">
                      <label htmlFor="productImage">Click here to add image</label>
                      <input
                        type="file"
                        id="productImage"
                        name="image"
                        onChange={changeValue}
                      />
                      {file && (
                        <div className="file-preview">
                          <img
                            src={URL.createObjectURL(file)}
                            height={100}
                            width={110}
                            alt="uploaded-file"
                          />
                        </div>
                      )}
                    </div>
                    <div className="form-group dash">
                      <button type="submit">Update product</button>
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
UpdateProductForm.propTypes={
  shop: PropTypes.shape.isRequired,
  products: PropTypes.arrayOf(Object).isRequired,
  close: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired,
}
export default UpdateProductForm