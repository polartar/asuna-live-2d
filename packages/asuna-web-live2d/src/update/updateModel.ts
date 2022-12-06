import { WorldState } from "../state/WorldState"

import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { CubismDefaultParameterId } from 'cubism-framework/dist/cubismdefaultparameterid'
import { CubismId } from "cubism-framework/dist/id/cubismid"

const reactions = {
  'Face': ['smile', 'head_shake', 'head_weave'],
  'Body': ['head_bob'],
  'Bust': ['bounce', 'puff', 'disdain']
}

let bust_cycle = 0
let lastMotion = -1

export function updateModel(state: WorldState, dt: number) {
  for (let m of Object.values(state.models)) {

    // move this to input
    let screenX = 2 * (-.5 + state.input.x / state.view.width)
    let screenY = 1 * 2 * (.5 - state.input.y / state.view.height)

    /* disable drag
    if (!state.input.drag) {
      screenX = 0
      screenY = 0
    }
    */

    // hit detection

    for (let i = 0; i < m.asset.setting.getHitAreasCount(); i++) {
      if (state.input.mouseDown && m.asset.isHit(m.asset.setting.getHitAreaId(i), screenX, screenY)) {

        if (lastMotion !== -1) {
          continue
        }

        if (m.asset.setting.getHitAreaName(i) === 'Face') {
          lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Face'][Math.floor(3 * Math.random())]], false, 3)
        } else if (m.asset.setting.getHitAreaName(i) === 'Body') {
          lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Body'][0]], false, 3)
        } else if (m.asset.setting.getHitAreaName(i) === 'Bust') {
          lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Bust'][bust_cycle++ % 3]], false, 3)
        }

        screenX = 0
        screenY = 0
        m.asset.setDragging(screenX, screenY)

        break
      }
    }

    if (lastMotion === -1) {
      m.asset.setDragging(screenX, screenY)
    }

    m.asset._dragManager.update(2.5 * dt)
    const dragX = m.asset._dragManager.getX()
    const dragY = m.asset._dragManager.getY()

    let uniform = CubismFramework.getIdManager().getId('Param4')
    let xId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX)
    let yId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY)
    let bxId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX)
    let byId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleY)

    m.asset._model.setParameterValueById(uniform, 1)
    m.asset._model.setParameterValueById(xId, 0)
    m.asset._model.setParameterValueById(yId, 0)
    m.asset._model.setParameterValueById(bxId, 0)
    m.asset._model.setParameterValueById(byId, 0)

    // m.asset._model.loadParameters()
    // m.asset._model.saveParameters()

    if (m.asset._breath != null) {
      const pid = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath)
      m.asset._model.setParameterValueById(pid, 0)
      m.asset._breath.updateParameters(m.asset._model, dt)
    }

    if (m.asset._eyeBlink !== null) {
      m.asset._eyeBlink.updateParameters(m.asset._model, dt)
    }

    if (m.asset._motionManager != null) {

      if (lastMotion !== -1 && m.asset._motionManager.isFinishedByHandle(lastMotion)) {
        lastMotion = -1
      }

      if (m.asset._motionManager.isFinished()) {
        m.asset._motionManager.startMotionPriority(m.asset.motions['idle'], false, 3)
      } else {
        m.asset._motionManager.updateMotion(m.asset._model, dt)
      }
    }

    m.asset._model.addParameterValueById(xId, dragX * 30)
    m.asset._model.addParameterValueById(yId, dragY * 30)
    m.asset._model.addParameterValueById(bxId, dragX * 10)
    m.asset._model.addParameterValueById(byId, dragY * 10)

    if (m.asset._physics != null) {
      m.asset._physics.evaluate(m.asset._model, dt)
    }

    if (state.external.override) {
      m.asset._model.setParameterValueById(xId, 30 * state.external.faceX)
      m.asset._model.setParameterValueById(yId, 30 * state.external.faceY)
      m.asset._model.setParameterValueById(bxId, 10 * state.external.bodyX)
      m.asset._model.setParameterValueById(byId, 10 * state.external.bodyY)
    }

    m.asset._model.update()
  }
}