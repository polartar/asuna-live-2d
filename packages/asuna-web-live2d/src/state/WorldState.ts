import { ViewState } from "./ViewState"
import { LoaderState } from "./LoaderState"
import { Model } from "./Model"

export class WorldState {
  lastId: number
  loader: LoaderState
  view: ViewState
  models: { [id: number]: Model }

  constructor() {
    this.lastId = 0
    this.loader = new LoaderState()
    this.view = new ViewState()
    this.models = {}
  }
}