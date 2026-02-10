/* eslint-disable no-unused-vars */
import './addProduct/style.css'
import { useState } from 'react'
import supabase from '../../supabase.config'
import PropTypes from 'prop-types'

// eslint-disable-next-line no-unused-vars
const UpdateProductForm = ({shop, products, close, onProductUpdated}) => {

  const [isUpdatating, setIsUpdating ] = useState(false)
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
                ref: selectedProduct.ref || '', 
                shopRef: shop.ref,
                name: selectedProduct.name || '',
                category: selectedProduct.category || '',
                summary: selectedProduct.summary || '',
                description: selectedProduct.description || '',
                supplier: selectedProduct.supplier || '',
                price: selectedProduct.price.toString() || '',
                image: selectedProduct.image || ''
            });
            setFile(null); 
        } else {
            setProductData({
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

        setIsUpdating(true)
        try {
            let imageUrl

            if(file){
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}.${fileExt}`;
              const filePath = `products/${fileName}`;

              const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('inventory_products_bucket')
                  .upload(filePath, file);

              if (uploadError) throw uploadError;

              const { data: urlData } = supabase.storage
                  .from('inventory_products_bucket')
                  .getPublicUrl(filePath);

              imageUrl = urlData.publicUrl;
            }
            console.log(productData)
            const {data, error }= await supabase
            .from('inventory_products')
            .update({
              companyref: shop.ref,
              name: productData.name,
              category: productData.category,
              summary: productData.summary,
              description: productData.description,
              supplier: productData.supplier,
              price: productData.price,
              image: imageUrl? imageUrl : productData.image
            })
            .eq('ref', productData.ref)
            .select()

            if(error){
              console.error('Erreur lors de la mise à jour du produit', error)
              setIsUpdating(false)
              return
            }
            const newProduct = data
          if (newProduct) {
            onProductUpdated(newProduct[0]);
            setIsUpdating(false)
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
                      <button type="submit" disabled={isUpdatating}>{isUpdatating? 'Updating...' : 'Update product'}</button>
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
UpdateProductForm.propTypes={
  shop: PropTypes.shape.isRequired,
  products: PropTypes.arrayOf(Object).isRequired,
  close: PropTypes.func.isRequired,
  onProductUpdated: PropTypes.func.isRequired,
}
export default UpdateProductForm