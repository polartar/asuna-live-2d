import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import modalReducer from './modal'
import inventoryReducer from './inventory'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    inventory: inventoryReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
