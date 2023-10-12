import { Canvas } from './Canvas'
import { Loader } from './Loader'
import { WebGL } from './WebGL'
import { AssetStore } from './asset/AssetStore'
import { LoaderStatus } from './state/LoaderState'
import { WorldState } from './state/WorldState'
import { update } from './update/update'
import { render } from './render/render'
import { MessageType, Messenger } from './external/Messenger'
import { Events } from './Events'
import { ModelLayer } from './state/ModelState'
import { Model } from './struct/Model'
import { Live2dModel } from './asset/Live2dModel'

const frameIntervalMax = 1.0 / 59
const frameIntervalMin = 1.0 / 61
let frameElapsedTime = 0

export default new class App {
  canvas: Canvas
  events: Events
  loader: Loader
  webgl: WebGL
  assets: AssetStore
  state: WorldState
  messenger: Messenger

  constructor() {
    this.assets = new AssetStore()
    this.state = new WorldState(this.assets)
    this.canvas = new Canvas(this.state)
    this.events = new Events(this.state.input)
    this.webgl = new WebGL(this.canvas.element)
    this.loader = new Loader(this.webgl, this.assets, this.state.models, this.state.motions, this.state.loader)
    this.messenger = new Messenger(this.state, this.loader, this.assets)

    this.setupScene().then(() => {
      this.messenger.sendMessage(MessageType.CS_Loaded, null)
      // TODO: load sync
      this.run()
    })

    this.loadMetadata()
  }

  getLayer(name: string): ModelLayer {
    return ModelLayer[name as keyof typeof ModelLayer];
  }

  getValue(layer: string) {
    if (layer === 'Outfit') {
      return `Outfit/` + ['Ace_Of_Spades', 'Magic_Apprentice', 'Silverhorn', 'Sweater_Vest','White_Tank_Top'][Math.floor(Math.random()* 100) % 5]
    }  
  }

   
  async loadMetadata (){
    const path = window.location.pathname
    if (path.includes('embed')) {
      const id = path.split("/")[2];
      try {
        const response = await fetch(`https://regen.asunaverse.com/api/metadata/${id}`);
        if(response.status === 200) {
          const metadata = await response.json();
          const attributes = metadata.attributes;
          attributes.forEach( async(attribute:{ trait_type: string, Value: string}) => {
            const id = `model/${this.getValue(attribute.trait_type)}`
            const layer = this.getLayer(attribute.trait_type)
            
            if (!id.includes("undefined") && layer) {
              const msg: any = {
                id: 0,
                type: MessageType.SC_SwapModel,
                payload: {
                    // layer: ModelLayer.Outfit,
                    // id: "model/Outfit/Sweater_Vest",
                    layer: layer,
                    id: id
                    // id: `model/${attribute.trait_type}/${attribute.Value}`,
                },
              }

              await this.messenger.updateModel(msg)
            }
            
          });
        }
      } catch(err) {
        console.log(err)
      }
    }

    
   
  }

  async setupScene() {
    this.loader.resetLoader(LoaderStatus.PRELOAD)
    await this.loader.loadAll([
      // this.loader.loadModelAsset('model/Back_Hair/Back_Messy_Long_Gray'),
      this.loader.loadModelAsset('model/Body/Body'),
      // this.loader.loadModelAsset('model/Front_Hair/Front_Messy_Long_Gray'),
      // this.loader.loadModelAsset('model/Eyes/Blue_Eyes'),
      this.loader.loadModelAsset('model/Outfit/Ace_Of_Spades'),
      // this.loader.loadModelAsset('model/Outfit/Magic_Apprentice'),
      // this.loader.loadModelAsset('model/Outfit/Silverhorn'),
      // this.loader.loadModelAsset('model/Outfit/Sweater_Vest'),
      // this.loader.loadModelAsset('model/Outfit/White_Tank_Top')
    ])

    this.loader.reinitialize()
    this.state.models.data[ModelLayer.Outfit] = new Model(this.assets.get('model/Outfit/Ace_Of_Spades') as Live2dModel)
  }

  run() {
    let prev = performance.now()

    const loop = (now: DOMHighResTimeStamp) => {
      const dt = (now - prev) / 1000
      prev = now
      frameElapsedTime += dt

      if (frameElapsedTime > frameIntervalMin) {
        update(this.state, frameIntervalMax)
        render(this.webgl, this.state)

        frameElapsedTime -= frameIntervalMax
        frameElapsedTime = Math.max(Math.min(frameElapsedTime, frameIntervalMin), 0)
      }

      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }

  teardown() {
    // TODO
  }
}()
