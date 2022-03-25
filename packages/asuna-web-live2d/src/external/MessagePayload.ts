import { Live2dModelId } from "../asset/Live2dModel"

export type Payload_SC_SwapTexture = {
  modelId: Live2dModelId,
  index: number,
  variant: number
}

export type Payload_SC_SetParameterOverride = {
  override: boolean
}

export type Payload_SC_SetParameters = {
  faceX: number,
  faceY: number,
  bodyX: number,
  bodyY: number
}
