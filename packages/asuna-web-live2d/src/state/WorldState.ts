import { ViewState } from "./ViewState"
import { LoaderState } from "./LoaderState"
import { InputState } from "./InputState"
import { ExternalState } from "./ExternalState"
import { ModelState } from "./ModelState"
import { CubismMotion } from "cubism-framework/dist/motion/cubismmotion"
import { AssetStore } from "../asset/AssetStore"
import { Loader } from "../Loader"

export class WorldState {
  lastId: number
  loader: LoaderState
  view: ViewState
  input: InputState
  external: ExternalState
  models: ModelState
  motions: { [name: string]: CubismMotion }
  params: { [id: string]: number }

  constructor(assets: AssetStore) {
    this.lastId = 0
    this.loader = new LoaderState()
    this.view = new ViewState()
    this.input = new InputState()
    this.external = new ExternalState()
    this.models = new ModelState(assets)
    this.motions = {}
    this.params = {}
  }
}