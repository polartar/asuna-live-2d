import { CubismRenderer_WebGL } from "asuna-cubism-framework/dist/legacy/render/cubismrenderer_webgl"
import { WorldState } from "../state/WorldState"
import { WebGL } from "../WebGL"

export function render({ gl, framebuffer }: WebGL, state: WorldState) {

  for (let m of Object.values(state.models.data)) {

    if (m === null) continue

    m.asset.renderer.setMvpMatrix(state.view.mvp)
    m.asset.renderer.setRenderState(framebuffer, [0, 0, state.view.width, state.view.height])
    // m.asset.renderer.drawModel()

    ////////////////////////////////////////////////////////////////////////////////
    // Predraw

    let renderer = m.asset.renderer

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

    let renderer = m.asset.renderer
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