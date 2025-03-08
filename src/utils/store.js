import { configureStore } from '@reduxjs/toolkit';
import navReducer from '../utils/Redux';

export const store = configureStore({
  reducer: {
    nav: navReducer
  }
}); 