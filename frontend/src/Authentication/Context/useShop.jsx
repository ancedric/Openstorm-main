import { GetUserShops } from '../shop'

const useShop = () => {

  const getShop = (email) =>{
    return GetUserShops(email)
  }

  return { getShop }
}

export default useShop