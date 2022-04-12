import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import inventoryReducer from './inventory'

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
