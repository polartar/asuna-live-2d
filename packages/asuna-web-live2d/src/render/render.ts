import { CubismMatrix44 } from 'cubism-framework/dist/math/cubismmatrix44'
import { CubismRenderer_WebGL } from 'cubism-framework/dist/rendering/cubismrenderer_webgl'
import { WorldState } from "../state/WorldState"
import { WebGL } from "../WebGL"

export function render({ gl, framebuffer }: WebGL, state: WorldState) {

  for (let m of Object.values(state.models.data)) {

    if (m === null) continue

    // TODO: move matrix to view, making a new matrix every frame is bad
    const scale = 2.55
    let mat = new CubismMatrix44()
    mat.scale(scale * state.view.height / state.view.width, scale * 1.0)
    mat.translateY(.2)

    m.asset.getRenderer().setMvpMatrix(mat)
    m.asset.getRenderer().setRenderState(framebuffer, [0, 0, state.view.width, state.view.height])
    // m.asset.getRenderer().drawModel()

    ////////////////////////////////////////////////////////////////////////////////
    // Predraw

    let renderer = m.asset.getRenderer()

    if (renderer._clippingManager != null) {
      renderer.preDraw()
      renderer._clippingManager.setupClippingContext(renderer.getModel(), renderer)
    }
    renderer.preDraw()

    ////////////////////////////////////////////////////////////////////////////////
  }

  let orderedDrawables: { r: CubismRenderer_WebGL, i: number, rr: number, d: number }[] = []

  for (let [id, m] of Object.values(state.models.data).entries()) {

    if (m === null) continue

    let renderer = m.asset.getRenderer()
    let drawOrder = renderer.getModel().getDrawableDrawOrders()
    let renderOrder = renderer.getModel().getDrawableRenderOrders()

    for (let i = 0; i < drawOrder.length; i++) {
      orderedDrawables.push({
        r: renderer,
        i,
        rr: renderOrder[i],
        d: drawOrder[i]
      })
    }
  }

  orderedDrawables.sort((a, b) => {
    if (a.d === b.d) {
      return a.rr - b.rr
    } else {
      return a.d - b.d
    }
  })

  for (let item of orderedDrawables) {

    let renderer = item.r

    // Pass the process if Drawable is not displayed
    if (!renderer.getModel().getDrawableDynamicFlagIsVisible(item.i)) {
      continue
    }

    // Set the clipping mask
    renderer.setClippingContextBufferForDraw(
      renderer._clippingManager != null
        ? renderer._clippingManager
          .getClippingContextListForDraw()
          .at(item.i)
        : null as any
    )

    renderer.setIsCulling(renderer.getModel().getDrawableCulling(item.i))

    renderer.drawMesh(
      renderer.getModel().getDrawableTextureIndices(item.i),
      renderer.getModel().getDrawableVertexIndexCount(item.i),
      renderer.getModel().getDrawableVertexCount(item.i),
      renderer.getModel().getDrawableVertexIndices(item.i),
      renderer.getModel().getDrawableVertices(item.i),
      renderer.getModel().getDrawableVertexUvs(item.i),
      renderer.getModel().getDrawableOpacity(item.i),
      renderer.getModel().getDrawableBlendMode(item.i),
      renderer.getModel().getDrawableInvertedMaskBit(item.i)
    )

  }
}