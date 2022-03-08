import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { CubismDefaultParameterId } from 'cubism-framework/dist/cubismdefaultparameterid'
import { ICubismModelSetting } from 'cubism-framework/dist/icubismmodelsetting'
import { CubismModelSettingJson } from 'cubism-framework/dist/cubismmodelsettingjson'
import { BreathParameterData, CubismBreath } from 'cubism-framework/dist/effect/cubismbreath'
import { CubismEyeBlink } from 'cubism-framework/dist/effect/cubismeyeblink'
import { csmVector } from 'cubism-framework/dist/type/csmvector'
import * as define from './define'
import { AssetId, AssetStore } from './asset/AssetStore'
import { Live2dModelId, Live2dModel } from './asset/Live2dModel'
import { Texture, TextureId } from './asset/Texture'
import { LoaderState, LoaderStatus } from './state/LoaderState'
import { WebGL } from './WebGL'

export enum FetchFormat {
  Buffer,
  JSON,
  Image
}

export class Loader {
  webgl: WebGL
  assetStore: AssetStore
  loaderState: LoaderState
  lastId: number

  constructor(webgl: WebGL, assetStore: AssetStore, loaderState: LoaderState) {
    this.webgl = webgl
    this.assetStore = assetStore
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
      console.log('loaded')
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
    const fname = id.split('/')[1]
    const buffer = await this.fetchResource(`${path}${fname}${define.EXT_MANIFEST}`, FetchFormat.Buffer) as ArrayBuffer
    const setting: ICubismModelSetting = new CubismModelSettingJson(buffer, buffer.byteLength)

    const loadBuffer = async (func: () => string) => {
      if (func.bind(setting)() === '') {
        return
      }
      return await this.fetchResource(`${path}${func.bind(setting)()}`, FetchFormat.Buffer) as ArrayBuffer
    }

    const modelFiles = [
      setting.getModelFileName,
      setting.getPhysicsFileName
    ]
    const textureFiles = Array(setting.getTextureCount()).fill(true).map(() => `texture/${fname}.8192`) // TODO: proper filename mapping
    const res = await Promise.all([
      ...modelFiles.map(loadBuffer),
      ...textureFiles.map(this.loadTexture.bind(this))
    ])
    const buffers = res.slice(0, modelFiles.length) as ArrayBuffer[]
    const textures = res.slice(modelFiles.length) as Texture[]
    const asset = new Live2dModel(id)

    // setup model systems
    if (!buffers[0]) {
      throw `Model not specified ${id}`
    }
    asset.loadModel(buffers[0])
    if (buffers[1]) {
      asset.loadPhysics(buffers[1], buffers[1].byteLength)
    }

    if (setting.getEyeBlinkParameterCount() > 0) {
      asset._eyeBlink = CubismEyeBlink.create(setting)
    }

    let val = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath)

    const breathParameters: csmVector<BreathParameterData> = new csmVector()
    breathParameters.pushBack(new BreathParameterData(
      CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath),
      0.5, 0.5, 3.2345, 1
    ))
    asset._breath = CubismBreath.create()
    asset._breath.setParameters(breathParameters)

    // setup model textures
    asset.resetRenderer(this.webgl.gl)
    textures.map((tex, idx) => {
      asset.getRenderer().bindTexture(idx, tex.data)
    })

    this.assetStore.set(id, asset)
    return asset
  }

  async loadTexture(id: TextureId) {
    // TODO: model - texture directory structure
    const path = `${define.URL_CDN}${id}/`
    const fname = 'texture_00'

    const img = await this.fetchResource(`${path}${fname}${define.EXT_TEXTURE}`, FetchFormat.Image) as HTMLImageElement
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
      } else if (type === FetchFormat.Image) {
        let img = new Image()
        return new Promise((resolve, reject) => {
          img.onload = () => resolve(img)
          img.onerror = () => reject('Error loading image')
          img.src = path
        })
      }
    } catch (e) {
      throw `Failed to fetch ${path}`
    }
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