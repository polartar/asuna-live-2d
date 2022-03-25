import { AsyncThunkAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MessageType, Payload_SC_SetParameterOverride, Payload_SC_SetParameters, Payload_SC_SwapTexture } from 'asuna-web-live2d'
import { Dispatch, RootState } from './store'
import { sendMessage } from '../messenger'

export enum Parameter {
  FaceX,
  FaceY,
  BodyX,
  BodyY
}

export const toggleOverride = createAsyncThunk<
  void,
  { value: boolean },
  { dispatch: Dispatch, state: RootState }
>('parameters/slide',
  async ({ value }, { dispatch, getState }) => {
    dispatch(setOverride(value))
    sendMessage(MessageType.SC_SetParameterOverride, {
      override: value
    } as Payload_SC_SetParameterOverride)
  }
)

export const slideParameter = createAsyncThunk<
  void,
  {
    param: Parameter
    value: number
  },
  { dispatch: Dispatch, state: RootState }
>('parameters/slide',
  async ({ param, value }, { dispatch, getState }) => {
    dispatch(setParameterValue({ param, value }))
    const params = getState().parameters.value
    sendMessage(MessageType.SC_SetParameters, {
      faceX: params[Parameter.FaceX],
      faceY: params[Parameter.FaceY],
      bodyX: params[Parameter.BodyX],
      bodyY: params[Parameter.BodyY]
    } as Payload_SC_SetParameters)
  }
)

export const Parameters = createSlice({
  name: 'parameters',
  initialState: {
    override: false,
    value: {
      [Parameter.FaceX]: 50,
      [Parameter.FaceY]: 50,
      [Parameter.BodyX]: 50,
      [Parameter.BodyY]: 50
    }
  },
  reducers: {
    setOverride: (state, action: PayloadAction<boolean>) => {
      state.override = action.payload
    },
    setParameterValue: (state, action: PayloadAction<{ param: Parameter, value: number }>) => {
      const snapThreshold = 3
      let value = Math.max(0, Math.min(100, action.payload.value))

      if (value < snapThreshold) {
        value = 0
      } else if (value > 100 - snapThreshold) {
        value = 100
      } else if (value > 50 - snapThreshold && value < 50 + snapThreshold) (
        value = 50
      )

      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.param]: value
        }
      }
    }
  }
})

export const { setOverride, setParameterValue } = Parameters.actions
export default Parameters.reducer