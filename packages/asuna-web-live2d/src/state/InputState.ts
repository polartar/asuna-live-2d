export class InputState {
  x: number
  y: number
  mouseDown: boolean
  drag: boolean
  lastUpdated: number

  constructor() {
    this.x = 0
    this.y = 0
    this.mouseDown = false
    this.drag = false
    this.lastUpdated = Date.now()
  }
}