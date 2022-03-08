import { CubismMatrix44 } from 'cubism-framework/dist/math/cubismmatrix44'
import { WorldState } from "../state/WorldState";
import { WebGL } from "../WebGL";

export function render({ gl, framebuffer }: WebGL, state: WorldState) {

  for (let m of Object.values(state.models)) {
    // TODO: move matrix to view, making a new matrix every frame is bad
    const mat = new CubismMatrix44()
    mat.scale(state.view.height / state.view.width, 1.0)

    m.asset.getRenderer().setMvpMatrix(mat)
    m.asset.getRenderer().setRenderState(framebuffer, [0, 0, state.view.width, state.view.height]);
    m.asset.getRenderer().drawModel()
  }
}