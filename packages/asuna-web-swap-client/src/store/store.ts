import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import inventoryReducer from './inventory'

const store = configureStore({
  reducer: {
    inventory: inventoryReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<Dispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
