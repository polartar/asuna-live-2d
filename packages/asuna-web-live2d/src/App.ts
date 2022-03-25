import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { Canvas } from './Canvas'
import { Loader } from './Loader'
import { WebGL } from './WebGL'
import { AssetStore } from './asset/AssetStore'
import { LoaderStatus } from './state/LoaderState'
import { WorldState } from './state/WorldState'
import { Model } from './state/Model'
import { Live2dModel } from './asset/Live2dModel'
import { update } from './update/update'
import { render } from './render/render'
import { MessageType, Messenger } from './external/Messenger'
import { Events } from './Events'

export default new class App {
  canvas: Canvas
  events: Events
  loader: Loader
  webgl: WebGL
  assets: AssetStore
  state: WorldState
  messenger: Messenger

  constructor() {
    CubismFramework.startUp()
    CubismFramework.initialize()

    this.assets = new AssetStore()
    this.state = new WorldState()
    this.canvas = new Canvas(this.state)
    this.events = new Events(this.state.input)
    this.webgl = new WebGL(this.canvas.element)
    this.loader = new Loader(this.webgl, this.assets, this.state.loader)
    this.messenger = new Messenger(this.state, this.loader, this.assets)

    this.setupScene().then(() => {
      this.messenger.sendMessage(MessageType.CS_Loaded, null)
      // TODO: load sync
      this.run()
    })
  }

  async setupScene() {
    this.loader.resetLoader(LoaderStatus.PRELOAD)
    await this.loader.loadAll([
      this.loader.loadModelAsset('model/000001')
    ])
    this.registerModel(new Model(this.assets.get('model/000001') as Live2dModel))
  }

  run() {
    let prev = performance.now()

    const loop = (now: DOMHighResTimeStamp) => {
      const dt = (now - prev) / 1000
      prev = now

      update(this.state, dt)
      render(this.webgl, this.state)
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  teardown() {
    // TODO
  }

  // TODO: fine better place for this
  registerModel(model: Model) {
    this.state.models[this.state.lastId++] = model
    model.id = this.state.lastId
  }
}()