import * as define from './define'
import { ModelJson } from 'asuna-cubism-framework/dist/model/Model'
import { AssetId, AssetStore } from './asset/AssetStore'
import { Live2dModelId, Live2dModel } from './asset/Live2dModel'
import { Texture, TextureId } from './asset/Texture'
import { LoaderState, LoaderStatus } from './state/LoaderState'
import { WebGL } from './WebGL'
import { WorldState } from './state/WorldState'
import { ModelData, ModelLayer } from './state/ModelState'
import { Model } from './struct/Model'

export enum FetchFormat {
  Buffer,
  JSON,
  Image
}

export class Loader {
  webgl: WebGL
  assetStore: AssetStore
  models: WorldState['models']
  motions: WorldState['motions']
  loaderState: LoaderState
  lastId: number

  constructor(webgl: WebGL, assetStore: AssetStore, models: WorldState['models'], motions: WorldState['motions'], loaderState: LoaderState) {
    this.webgl = webgl
    this.assetStore = assetStore
    this.models = models
    this.motions = motions
    this.loaderState = loaderState
    this.lastId = 0
  }

  resetLoader(status: LoaderStatus) {
    this.loaderState.status = status
    this.loaderState.errorStatus = false
    this.loaderState.error = ''
    this.loaderState.done = 0
    this.loaderState.total = 0
  }

  async loadAll(prom: Promise<any>[]) {
    try {
      let res = await Promise.all(prom)
      this.loaderState.status = LoaderStatus.READY
      return res
    } catch (err) {
      this.loaderState.status = LoaderStatus.ERROR
      this.loaderState.errorStatus = true
      this.loaderState.error = `Failed to load resources: ${err}`
      console.error(this.loaderState.error)
      throw err
    }
  }

  async loadModelAsset(id: Live2dModelId): Promise<Live2dModel> {
    // TODO: set progress breakpoints
    if (this.assetStore.has(id)) {
      return Promise.resolve(this.assetStore.get(id) as Live2dModel)
    }

    this.incTotalProgress(10)
    const path = `${define.URL_CDN}${id}/`
    const fname = id.split('/')[2]
    const setting = await this.fetchResource(`${path}${fname}${define.EXT_MANIFEST}`, FetchFormat.JSON) as ModelJson
    const motionFiles = setting.FileReferences.Motions ? Object.values(setting.FileReferences.Motions).flat().map(obj => path + obj.File) : []
    const modelFile = path + setting.FileReferences.Moc
    const jsonFiles = [
      path + setting.FileReferences.Physics,
      ...motionFiles
    ]
    const textureFiles = setting.FileReferences.Textures.map((_, idx) => `${id}/${fname}.00/texture_${String(idx).padStart(2, '0')}`)
    const res = await Promise.all([
      this.fetchResource(modelFile, FetchFormat.Buffer),
      ...jsonFiles.map(path => this.fetchResource(path, FetchFormat.JSON)),
      ...textureFiles.map(this.loadTexture.bind(this))
    ])
    const modelBuffer = res[0] as ArrayBuffer
    const physicsSettings = res[1]
    const motionSettings = res.slice(2, 2 + motionFiles.length) as any[]
    const textures = res.slice(2 + motionFiles.length) as Texture[]
    const asset = new Live2dModel({
      id,
      setting,
      physicsJSON: physicsSettings || null,
      modelData: modelBuffer,
      gl: this.webgl.gl
    })

    // // load motions
    // if (buffers[2]) {
    //   for (let [i, buffer] of buffers.slice(2).entries()) {
    //     let name = motionFiles[i].match(/\/(.+)\.motion/)![1]
    //     let motion = asset.loadMotion(buffer, buffer.byteLength, name)
    //     motion.setEffectIds(new csmVector<CubismIdHandle>(), new csmVector<CubismIdHandle>())
    //     this.motions[name] = motion
    //   }
    // }

    // if (setting.getEyeBlinkParameterCount() > 0) {
    //   asset._eyeBlink = CubismEyeBlink.create(setting)
    // }

    // let val = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath)

    // const breathParameters: csmVector<BreathParameterData> = new csmVector()
    // breathParameters.pushBack(new BreathParameterData(
    //   CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath),
    //   0.5, 0.5, 3.2345, 1
    // ))
    // asset._breath = CubismBreath.create()
    // asset._breath.setParameters(breathParameters)

    // setup model textures
    textures.map((tex, idx) => {
      asset.renderer.bindTexture(idx, tex.data)
    })

    console.log(asset._model)

    this.assetStore.set(id, asset)
    return asset
  }

  async loadTexture(id: TextureId) {
    // TODO: model - texture directory structure
    const path = `${define.URL_CDN}${id}`
    const img = await this.fetchResource(`${path}${define.EXT_TEXTURE}`, FetchFormat.Image) as HTMLImageElement
    const tex = this.webgl.bindTexture(img, true)
    const asset = new Texture({
      id,
      width: img.width,
      height: img.height,
      data: tex,
      elem: img,
      premultiply: true
    })

    this.assetStore.set(id, asset)
    return asset
  }

  async fetchResource(path: string, type: FetchFormat) {
    try {
      if (type === FetchFormat.Buffer) {
        let res = await fetch(path)
        return res.arrayBuffer()
      } else if (type === FetchFormat.JSON) {
        let res = await fetch(path)
        return res.json()
      } else if (type === FetchFormat.Image) {
        let img = new Image()
        return new Promise((resolve, reject) => {
          img.onload = () => resolve(img)
          img.onerror = () => reject('Error loading image')
          img.crossOrigin = 'anonymous'
          img.src = path
        })
      }
    } catch (e) {
      throw `Failed to fetch ${path}`
    }
  }

  async reinitialize() {
    let data = this.models.data

    for (let k of Object.keys(data) as any as Array<keyof ModelData>) {
      if (data[k] !== null) {
        this.assetStore.delete(data[k]!.asset.id)
        data[k] = null
      }
    }

    await this.loadModelAsset('model/Body/Body')
    data[ModelLayer.Body] = new Model(this.assetStore.get('model/Body/Body') as Live2dModel)
  }

  incProgress(n: number = 1) {
    if (this.loaderState.status === LoaderStatus.PRELOAD || this.loaderState.status === LoaderStatus.LOAD) {
      this.loaderState.done += n
    }
  }

  incTotalProgress(n: number = 1) {
    if (this.loaderState.status === LoaderStatus.PRELOAD || this.loaderState.status === LoaderStatus.LOAD) {
      this.loaderState.total += n
    }
  }

  release(id: AssetId) {
    // TODO
  }
}