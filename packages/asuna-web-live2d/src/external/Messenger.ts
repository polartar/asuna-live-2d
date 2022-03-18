import { Loader } from "../Loader"
import { AssetStore } from "../asset/AssetStore"
import { Live2dModel } from "../asset/Live2dModel"
import { Payload_SC_SwapTexture } from "./MessagePayload"

const PARENT_ORIGIN = 'http://localhost:8080'

export type MessageId = number
export type Message<T> = {
  id: MessageId,
  type: MessageType,
  payload: T
}
export enum MessageType {
  CS_Loaded,
  CS_Complete,

  SC_SwapTexture
}

export class Messenger {
  parentWindow: Window | null
  loader: Loader
  assetStore: AssetStore

  constructor(loader: Loader, assetStore: AssetStore) {
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

      if (msg.type === MessageType.SC_SwapTexture) {
        const payload = msg.payload as Payload_SC_SwapTexture
        if (!assetStore.has(payload.modelId)) {
          throw `Asset '${payload.modelId}' not found`
        }
        const asset = assetStore.get(payload.modelId) as Live2dModel
        const textureId = `texture/${payload.modelId.split('/')[1]}.${payload.index}/${String(payload.variant).padStart(2, '0')}`
        const texture = await loader.loadTexture(textureId)
        asset.getRenderer().bindTexture(payload.index, texture.data)
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