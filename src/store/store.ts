import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import roomsReducer from 'reducer/roomsReducer';
import currentRoomsReducer from 'reducer/currentRoomReducer';
import reserveReducer from 'reducer/recerveReducer';
import userReducer from 'reducer/userReducer';


export const store = configureStore({
  reducer: {
    rooms: roomsReducer,
    currentRoom: currentRoomsReducer,
    reserve: reserveReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
