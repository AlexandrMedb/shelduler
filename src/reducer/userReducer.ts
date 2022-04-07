import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState={
  uid: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUid: (state, action: PayloadAction<string>) => {
      state.uid= action.payload;
    },
  },
});

export const {setUid} = userSlice.actions;


export default userSlice.reducer;
