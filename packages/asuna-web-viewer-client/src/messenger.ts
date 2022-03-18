import { MessageId, Message, MessageType } from 'asuna-web-live2d'
import { IFrameStatus, setStatus } from './store/iframe'
import store from "./store/store"

const IFRAME_ORIGIN = 'http://localhost:8080'
let prevId: MessageId = 0
let callbacks: { [id: MessageId]: (payload: any) => void } = {}

export async function sendMessage<T>(type: MessageType, payload: T) {
  const elem = store.getState().iframe.iFrameElement
  if (!elem) {
    return
  }
  const targetWindow = elem.contentWindow
  if (!targetWindow) {
    throw 'IFrame window not initialized'
  }
  console.log('blep')
  const msg: Message<T> = {
    id: prevId++,
    type,
    payload
  }

  targetWindow.postMessage(msg, IFRAME_ORIGIN)
  return new Promise((resolve, reject) => {
    callbacks[prevId] = (payload) => {
      resolve(payload)
    }
  })
}

window.addEventListener('message', (event) => {
  if (event.origin !== IFRAME_ORIGIN) {
    throw 'Message origin does not match'
  }

  const msg = event.data as Message<any>

  if (msg.type === MessageType.CS_Loaded) {
    store.dispatch(setStatus(IFrameStatus.Ready))
  } else if (msg.type === MessageType.CS_Complete) {
    if (!(msg.id in callbacks)) {
      throw `Msg ${msg.id} already dispatched`
    }

    callbacks[msg.id](msg.payload)
    delete callbacks[msg.id]
  }
})
