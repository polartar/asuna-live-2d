import { WorldState } from "../state/WorldState"
import { handleInput } from "./handleInput"
import { updateModel } from "./updateModel"

export function update(state: WorldState, dt: number) {
  updateModel(state, dt)
  handleInput(state, dt)
}