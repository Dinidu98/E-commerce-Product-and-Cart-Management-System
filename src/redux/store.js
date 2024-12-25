import { configureStore } from '@reduxjs/toolkit';
import productReducer from './products/productSlice';
import cartReducer from './cart/cartSlice'

const store = configureStore({
  reducer: {
    products: productReducer,
    cart:cartReducer
  }
});

export default store;
