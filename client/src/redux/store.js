import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pizzaReducer from './slices/pizzaSlice';
import orderReducer from './slices/orderSlice';
import inventoryReducer from './slices/inventorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pizza: pizzaReducer,
    order: orderReducer,
    inventory: inventoryReducer,
  },
}); 