import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {roomInterface} from 'interfaces/shelduleInterfaces';


const initialState:roomInterface ={
  id: -1,
  name: '',
};


export const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState,
  reducers: {
    setRoom: (state, action: PayloadAction<roomInterface>) => {
      state= action.payload;
      return state;
    },
  },
});

export const {setRoom} = currentRoomSlice.actions;


export default currentRoomSlice.reducer;
