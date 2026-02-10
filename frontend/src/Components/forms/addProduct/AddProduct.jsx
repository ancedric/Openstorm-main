import './style.css'
import supabase from '../../../supabase.config';
import Toast from '../../toast';
import { useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const AddProductForm = ( {shop, close, onProductAdded}) => {
    const [productData, setProductData] = useState({
      ref: '',
      companyRef: shop.ref,
      name: '',
      category: '',
      summary: '',
      description: '',
      supplier: '',
      price: '',
      image: ''
    });
    const [toast, setToast] = useState({message:'', type:'', visible:false})
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = (event) => {
      setFile(event.target.files[0]);
    };

    const handleProductAdd = async (event) => {
        event.preventDefault()

        setIsUploading(true)
        const prodRef = `PROD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        try {
            if(!file) setToast({message: "Aucune image sélectionnée", type: "error", visible: true});
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            // eslint-disable-next-line no-unused-vars
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('inventory_products_bucket')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('inventory_products_bucket')
                .getPublicUrl(filePath);

            const imageUrl = urlData.publicUrl;

            const {data, error }= await supabase
            .from('inventory_products')
            .insert([{
              ref: prodRef,
              companyref: shop.ref,
              name: productData.name,
              category: productData.category,
              summary: productData.summary,
              description: productData.description,
              supplier: productData.supplier,
              price: productData.price,
              image: imageUrl
            }])
            .select()

            if(error){
              console.error('Erreur lors de la mise à jour du produit', error)
              setIsUploading(false)
              return
            }
            const newProduct = data
            if (newProduct) {
                setToast({message: "Product added successfully", type: "success", visible: true});
                onProductAdded(newProduct[0]);
                setIsUploading(false)
                close()
            }
        }
        catch(err){
          console.log(err)
          setToast({message: `Error while adding product:, ${err}`, type: "error", visible: true});
        }
    }
    const onChange = (e) => {
        setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  return (
    <div className="pop slide-up-1">
          <h3>Add Product</h3>
            <div className="product-form">
              <form
                encType="multipart/form-data"
                onSubmit={handleProductAdd}
                id="add-product-form"
              >
                <div className="form-group dash">
                  <label htmlFor="name">Product name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={onChange}
                    required
                  />
                  <label htmlFor="category">Product category</label>
                  <select
                    id="category"
                    name="category"
                    onChange={onChange}
                    required
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
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group dash">
                  <label htmlFor="summary">Product descriptive summary</label>
                  <input
                    type="text"
                    id="summary"
                    name="summary"
                    onChange={onChange}
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
                    onChange={onChange}
                  ></textarea>
                  <label htmlFor="supplier">supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    onChange={onChange}
                  />
                </div>
                <div className="form-group dash">
                  <label htmlFor="image">Click here to add image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageUpload}
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
                  <button type="submit" disabled={isUploading}>{isUploading? 'Uploading...' : 'Add product'}</button>
                </div>
              </form>
              <button className="close-btn" onClick={close}>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#54129b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
          </div>
          
          {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
        </div>
  )
}
AddProductForm.propTypes = {
  shop: PropTypes.shape.isRequired,
  close: PropTypes.func.isRequired,
  onProductAdded: PropTypes.func.isRequired
}
export default AddProductForm