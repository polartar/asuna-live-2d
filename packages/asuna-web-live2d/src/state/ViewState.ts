import { CubismMatrix44 } from "asuna-cubism-framework/dist/legacy/math/cubismmatrix44"

export class ViewState {
  width: number
  height: number
  mvp: CubismMatrix44

  constructor() {
    this.width = 0
    this.height = 0
    this.mvp = new CubismMatrix44()
  }
}