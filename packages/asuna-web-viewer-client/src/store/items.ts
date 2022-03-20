import { AsyncThunkAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch, RootState } from './store'
import iframe, { IFrameStatus } from './iframe'

export enum ItemGroup {
  BodyColor,
  EyeColor,
  HairColor
}

export const selectItem = createAsyncThunk<
  void,
  {
    group: ItemGroup
    index: number
    iFrameActions: AsyncThunkAction<any, any, any>[]
  },
  { dispatch: Dispatch, state: RootState }
>('items/select',
  async ({ group, index, iFrameActions }, { dispatch, getState }) => {
    if (getState().iframe.status === IFrameStatus.Pending) {
      return
    }
    dispatch(setCursorPosition({ group, index }))
    for (let action of iFrameActions) {
      await dispatch(action)
    }
  }
)

export const Items = createSlice({
  name: 'items',
  initialState: {
    cursorPosition: {
      [ItemGroup.BodyColor]: 0,
      [ItemGroup.EyeColor]: 1,
      [ItemGroup.HairColor]: 3
    }
  },
  reducers: {
    setCursorPosition: (state, action: PayloadAction<{ group: ItemGroup, index: number }>) => ({
      ...state,
      cursorPosition: {
        ...state.cursorPosition,
        [action.payload.group]: action.payload.index
      }
    })
  }
})

export const { setCursorPosition } = Items.actions
export default Items.reducer