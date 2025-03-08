import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNavbarOpen: true,
  user: null
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    toggleNav: (state) => {
      state.isNavbarOpen = !state.isNavbarOpen;
    }, 
    // set user
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { toggleNav, setUser } = navSlice.actions;
export default navSlice.reducer;