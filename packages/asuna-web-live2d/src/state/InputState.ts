export class InputState {
  x: number
  y: number
  drag: boolean
  lastUpdated: number

  constructor() {
    this.x = 0
    this.y = 0
    this.drag = false
    this.lastUpdated = Date.now()
  }
}