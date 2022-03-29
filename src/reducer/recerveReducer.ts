import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {reserveInterface} from 'interfaces/shelduleInterfaces';

const initialState:reserveInterface[] =[];


export const reserveSlice = createSlice({
  name: 'reserve',
  initialState,
  reducers: {
    setReserve: (state, action: PayloadAction<reserveInterface[]>) => {
      state= action.payload;
      return state;
    },
  },
});

export const {setReserve} = reserveSlice.actions;


export default reserveSlice.reducer;
