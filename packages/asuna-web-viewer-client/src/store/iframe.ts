import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessageType, Payload_SC_SwapTexture } from 'asuna-web-live2d'
import { sendMessage } from '../messenger'
import { Dispatch, RootState } from './store'

export enum IFrameStatus {
  Ready,
  Pending
}

const initialState = {
  status: IFrameStatus.Pending,
  iFrameElement: null as (HTMLIFrameElement | null)
}

export const swapTexture = createAsyncThunk<
  void,
  { modelId: string, index: number, variant: number },
  { dispatch: Dispatch, state: RootState }
>('iframe/swap',
  async ({ modelId, index, variant }, { dispatch, getState }) => {
    if (getState().iframe.status === IFrameStatus.Pending) {
      throw 'iframe action called while pending'
    }
    dispatch(setStatus(IFrameStatus.Pending))
    await sendMessage(MessageType.SC_SwapTexture, {
      modelId,
      index,
      variant
    } as Payload_SC_SwapTexture)
    dispatch(setStatus(IFrameStatus.Ready))
  }
)

export const IFrame = createSlice({
  name: 'iframe',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<IFrameStatus>) => {
      state.status = action.payload
    },
    setIFrameElement: (state, action: PayloadAction<HTMLIFrameElement>) => ({
      ...state,
      iFrameElement: action.payload
    })
  }
})

export const { setStatus, setIFrameElement } = IFrame.actions
export default IFrame.reducer
