import { configureStore } from '@reduxjs/toolkit'
import tabReducer from './tab'
import iframeReducer from './iframe'

const store = configureStore({
  reducer: {
    tab: tabReducer,
    iframe: iframeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
export default store
