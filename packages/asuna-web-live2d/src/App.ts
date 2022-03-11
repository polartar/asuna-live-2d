import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { Canvas } from './Canvas'
import { Loader } from './Loader'
import { WebGL } from './WebGL'
import { AssetStore } from './asset/AssetStore'
import { LoaderStatus } from './state/LoaderState'
import { WorldState } from './state/WorldState'
import { render } from './render/render'
import { Model } from './state/Model'
import { Live2dModel } from './asset/Live2dModel'
import { update } from './update/update'

export default new class App {
  canvas: Canvas
  loader: Loader
  webgl: WebGL
  assets: AssetStore
  state: WorldState

  constructor() {
    CubismFramework.startUp()
    CubismFramework.initialize()

    this.assets = new AssetStore()
    this.state = new WorldState()
    this.canvas = new Canvas(this.state.view)
    this.webgl = new WebGL(this.canvas.element)
    this.loader = new Loader(this.webgl, this.assets, this.state.loader)

    this.setupScene().then(() => {
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