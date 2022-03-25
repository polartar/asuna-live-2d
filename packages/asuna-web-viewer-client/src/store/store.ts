import { configureStore } from '@reduxjs/toolkit'
import tabReducer from './tab'
import iframeReducer from './iframe'
import itemsReducer from './items'
import paramsReducer from './parameters'

const store = configureStore({
  reducer: {
    tab: tabReducer,
    iframe: iframeReducer,
    items: itemsReducer,
    parameters: paramsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
export default store
