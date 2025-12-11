/* eslint-disable no-unused-vars */
import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  profile: null,
  shop: null,
  signIn: (email, password) => {},
  signOut: () => {},
  fectchProfile: ()=>{},
  fetchShop: () => {},
  isAuthenticated: false,
});

export default AuthContext;
