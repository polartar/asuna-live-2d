import { ViewState } from "./ViewState"
import { LoaderState } from "./LoaderState"
import { Model } from "./Model"
import { InputState } from "./InputState"
import { ExternalState } from "./ExternalState"

export class WorldState {
  lastId: number
  loader: LoaderState
  view: ViewState
  input: InputState
  external: ExternalState
  models: { [id: number]: Model }

  constructor() {
    this.lastId = 0
    this.loader = new LoaderState()
    this.view = new ViewState()
    this.input = new InputState()
    this.external = new ExternalState()
    this.models = {}
  }
}