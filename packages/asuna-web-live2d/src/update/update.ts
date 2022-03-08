import { WorldState } from "../state/WorldState"
import { updateModel } from "./updateModel"

export function update(state: WorldState, dt: number) {
  updateModel(state, dt)
}