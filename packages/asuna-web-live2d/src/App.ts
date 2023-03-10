import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { Canvas } from './Canvas'
import { Loader } from './Loader'
import { WebGL } from './WebGL'
import { AssetStore } from './asset/AssetStore'
import { LoaderStatus } from './state/LoaderState'
import { WorldState } from './state/WorldState'
import { Model } from './struct/Model'
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
    this.loader = new Loader(this.webgl, this.assets, this.state.motions, this.state.loader)
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
      // this.loader.loadModelAsset('model/Back_Hair/Back_Messy_Long_Gray'),
      this.loader.loadModelAsset('model/Body/Body'),
      // this.loader.loadModelAsset('model/Front_Hair/Front_Messy_Long_Gray'),
      // this.loader.loadModelAsset('model/Eyes/Blue_Eyes'),
      this.loader.loadModelAsset('model/Outfit/Ace_Of_Spades'),
      // this.loader.loadModelAsset('model/Outfit/Silverhorn'),
      // this.loader.loadModelAsset('model/Outfit/Sweater_Vest'),
      // this.loader.loadModelAsset('model/Outfit/White_Tank_Top')
    ])

    this.state.models.initialize(this.assets)
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
}()