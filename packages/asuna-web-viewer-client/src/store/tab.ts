import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum TabId {
  Body,
  Eye,
  Hair,
  Parameters
}

export const Tab = createSlice({
  name: 'tab',
  initialState: TabId.Body,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabId>) => {
      return action.payload
    }
  }
})

export const { setActiveTab } = Tab.actions
export default Tab.reducer