import { WorldState } from "../state/WorldState"

export function handleInput(state: WorldState, dt: number) {
  if (Date.now() - state.input.lastUpdated > 10000) {
    state.input.x = state.view.width / 2
    state.input.y = state.view.height / 2
  }
}