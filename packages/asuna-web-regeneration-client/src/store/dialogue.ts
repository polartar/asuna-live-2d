import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type DialogueState = {
  stage: number
  startTime: number
}

const initialState: DialogueState = {
  stage: 0,
  startTime: Date.now()
}

export const Dialogue = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    setStage: (state, action: PayloadAction<number>) => {
      state.stage = action.payload
    },
    setTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload
    }
  }
})

export const DialogueActions = Dialogue.actions
export default Dialogue.reducer
