import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {roomInterface} from '../interfaces/shelduleInterfaces';

const initialState:roomInterface[] =[];


export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<roomInterface[]>) => {
      state= action.payload;
      return state;
    },
  },
});

export const {setRooms} = roomsSlice.actions;


export default roomsSlice.reducer;
