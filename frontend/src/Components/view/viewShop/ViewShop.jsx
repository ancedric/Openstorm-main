import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetProducts, /*GetUserShops */} from '../../../Authentication/shop';
import './style.css';
import Loader from '../../Loader';
import Carousel from '../../Carousel';
import { baseURL } from '../../../axiosConfig';
import ProductCard from '../../cards/products/productCard';

const ViewShop = () => {
  const [products, setProducts] = useState([]);
  const { shopId } = useParams();
  const [shop, setShop] = useState()
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(false);
  const [bestSeller, setBestSeller] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isBestSellerOpen, setBestSellerOpen] = useState(true);
  const [isFavouritesOpen, setFavouritesOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [bestSellerSlides, setBestSellerSlides] = useState([]);
  const [favouriteSlides, setFavouriteSlides] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null); 


  /*useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await GetUserShops(shopId)
        if (shopData[0]) {
          setShop({
            id: shopData[0].id,
            shopName: shopData[0].shopName,
            shopLabel: shopData[0].shopLabel,
            shopEmail: shopData[0].email,
            shopPhone: shopData[0].phone,
            shopAddress: shopData[0].adress, 
            holdername: shopData[0].holderName,
            followers: shopData[0].followers,
            openTime: shopData[0].openTime,
            closeTime: shopData[0].closeTime,
            profileImageUrl: shopData[0].profileImageUrl,
          });
        } else {
          setError("Shop not found.");
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        setError("Failed to fetch shop data.");
      }
    }

    fetchShop()
  }, [shopId]);*/
  
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await GetProducts(shopId);
        if (productsData) {
          setProducts(productsData);
        } else {
          setError("No products found.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, [shopId])

  useEffect(() => {
    if (products.length > 0) {
      const topSell = [...products].sort((a, b) => b.nbSales - a.nbSales);
      setBestSeller(topSell);
      const favourite = [...products].sort((a, b) => b.nbLikes - a.nbLikes);
      setFavourites(favourite);
    }
  }, [products]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const newProducts = products.map(item => (
        <div key={item.productId} className='slide'>
          <ProductCard product={item} shop={shop} />
        </div>
      ));
      setSlides(newProducts);
    }
  }, [products, shop]);

  useEffect(() => {
    if (Array.isArray(bestSeller) && bestSeller.length > 0) {
      const newProducts = bestSeller.map(item => (
        <div key={item.productId} className='slide'>
          <ProductCard product={item} shop={shop} />
        </div>
      ));
      setBestSellerSlides(newProducts);
    }
  }, [bestSeller, shop]);

  useEffect(() => {
    if (Array.isArray(favourites) && favourites.length > 0) {
      const newProducts = favourites.map(item => (
        <div key={item.productId} className='slide'>
          <ProductCard product={item} shop={shop} />
        </div>
      ));
      setFavouriteSlides(newProducts);
    }
  }, [favourites, shop]);

  const listDisplay = () => setIsCategoryListVisible(true);
  const listNotDisplay = () => setIsCategoryListVisible(false);
  const openBestSeller = () => {
    closeFavourites();
    setBestSellerOpen(true);
  };
  const openFavourites = () => {
    closeBestSeller();
    setFavouritesOpen(true);
  };
  const closeBestSeller = () => setBestSellerOpen(false);
  const closeFavourites = () => setFavouritesOpen(false);

  const productCategories = [...new Set(products.map(product => product.category))];
  const filterProductsByCategory = (category) => {
    const filtered = category === 'All' ? products : products.filter(product => product.category === category);
    setFilteredProducts(filtered);
  };

  return (
    <div className='shop-ctn'>
      {error && <div className="error">{error}</div>}
      {!shop ? (
        <Loader />
      ) : (
        <>
          <div className='cat'>
            <div className="cat-header">
              <div style={{ width: '50%', height: '100%' }}>
                <img src={`${baseURL}/media/${shop.profileImageUrl}`} alt="shop-image" style={{ width: '100%', height: '100%', margin: '0' }} />
              </div>
              <div>
                <h4>{shop.name.toUpperCase()}</h4>
              </div>
            </div>

            <div>
              <div className='section-title'>
                <div className='category-title'>
                  <h4>SHOP CATALOG</h4>
                </div>
                <div className='category-list-filter' onClick={listDisplay}>
                  <h4>CATEGORIES</h4>
                </div>

                <div className={`category-list-items ${!isCategoryListVisible ? 'list-invisible' : ''}`}>
                  <ul>
                    <li onClick={() => filterProductsByCategory('All')}>All</li>
                    {productCategories.map((category, index) => (
                      <li key={index} onClick={() => filterProductsByCategory(category)}>{category}</li>
                    ))}
                  </ul>
                  <button className='close-btn' onClick={listNotDisplay}>
                    <img src="\frontend\src\assets\icons\close-square-svgrepo-com.svg" alt='close' width="35px" />
                  </button>
                </div>
              </div>

              <div className="carousel-container cat-container">
                <div className="commands catalog">
                  {filteredProducts.length > 0 ? (
                    <Carousel slides={filteredProducts} />
                  ) : products.length > 0 ? (
                    <Carousel slides={slides} />
                  ) : (
                    <div>No products in this shop...</div>
                  )}
                </div>
              </div>

              <div className='section-title'>
                <div className={`category-title ${isBestSellerOpen ? 'selected-title' : ''}`} onClick={openBestSeller}>
                  <h4>BEST SELLERS</h4>
                </div>
                <div className={`category-list ${isFavouritesOpen ? 'selected-title' : ''}`} onClick={openFavourites}>
                  <h4>FAVOURITE PRODUCTS</h4>
                </div>
              </div>

              {isBestSellerOpen && (
                <div className="carousel-container cat-container">
                  <div className="commands catalog">
                    {bestSeller.length > 0 ? (
                      <Carousel slides={bestSellerSlides} />
                    ) : (
                      <div>No best sellers in this shop...</div>
                    )}
                  </div>
                </div>
              )}

              {isFavouritesOpen && (
                <div className="carousel-container cat-container">
                  <div className="commands catalog">
                    {favourites.length > 0 ? (
                      <Carousel slides={favouriteSlides} />
                    ) : (
                      <div>No favourite products in this shop...</div>
                    )}
                  </div>
                </div>
              )}

              <p>Copyright S-Mall 2025</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewShop;