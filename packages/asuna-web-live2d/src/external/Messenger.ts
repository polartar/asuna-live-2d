import { Loader } from "../Loader"
import { AssetStore } from "../asset/AssetStore"
import { Live2dModel } from "../asset/Live2dModel"
import { Payload_SC_SetParameterOverride, Payload_SC_SetParameters, Payload_SC_SwapModel, Payload_SC_SwapTexture } from "./MessagePayload"
import { WorldState } from "../state/WorldState"
import { Model } from "../struct/Model"

const PARENT_ORIGIN = window.location.origin

export type MessageId = number
export type Message<T> = {
  id: MessageId,
  type: MessageType,
  payload: T
}
export enum MessageType {
  CS_Loaded,
  CS_Complete,

  SC_SwapModel,
  SC_SwapTexture,
  SC_SetParameterOverride,
  SC_SetParameters
}

export class Messenger {
  parentWindow: Window | null
  state: WorldState
  loader: Loader
  assetStore: AssetStore

  constructor(state: WorldState, loader: Loader, assetStore: AssetStore) {
    this.state = state
    this.loader = loader
    this.assetStore = assetStore

    this.parentWindow = window.parent || null
    if (!this.parentWindow) {
      return
    }

    window.addEventListener('message', async (event) => {
      if (event.origin !== PARENT_ORIGIN) {
        throw 'Message origin does not match'
      }

      const msg = event.data as Message<any>

      if (msg.type === MessageType.SC_SwapModel) {
        const payload = msg.payload as Payload_SC_SwapModel

        await this.loader.loadModelAsset(payload.id)
        let model = new Model(this.assetStore.get(payload.id) as Live2dModel)
        model.syncParams(this.state.params)
        this.state.models.data[payload.layer] = model

        for (let m of Object.values(this.state.models.data)) {
          m?.asset._motionManager.stopAllMotions()
        }

        this.sendMessage(MessageType.CS_Complete, null, msg.id)

      } else if (msg.type === MessageType.SC_SwapTexture) {

        const payload = msg.payload as Payload_SC_SwapTexture
        if (!assetStore.has(payload.modelId)) {
          throw `Asset '${payload.modelId}' not found`
        }
        const asset = assetStore.get(payload.modelId) as Live2dModel
        const textureId = `texture/${payload.modelId.split('/')[1]}.${payload.index}/${String(payload.variant).padStart(2, '0')}`
        const texture = await loader.loadTexture(textureId)
        asset.getRenderer().bindTexture(payload.index, texture.data)
        this.sendMessage(MessageType.CS_Complete, null, msg.id)

      } else if (msg.type === MessageType.SC_SetParameterOverride) {

        const payload = msg.payload as Payload_SC_SetParameterOverride
        this.state.external.override = payload.override
        this.sendMessage(MessageType.CS_Complete, null, msg.id)

      } else if (msg.type === MessageType.SC_SetParameters) {

        const payload = msg.payload as Payload_SC_SetParameters
        this.state.external.faceX = payload.faceX / 50 - 1
        this.state.external.faceY = payload.faceY / 50 - 1
        this.state.external.bodyX = payload.bodyX / 50 - 1
        this.state.external.bodyY = payload.bodyY / 50 - 1
        this.sendMessage(MessageType.CS_Complete, null, msg.id)

      }
    })
  }

  sendMessage<T>(type: MessageType, payload: T, id?: MessageId) {
    if (!this.parentWindow) {
      return
    }

    const msg: Message<T> = {
      id: id || 0,
      type,
      payload
    }
    this.parentWindow.postMessage(msg, PARENT_ORIGIN)
  }
}