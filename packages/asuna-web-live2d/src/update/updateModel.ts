import { WorldState } from "../state/WorldState"

const reactions = {
  'Face': ['smile', 'head_shake', 'head_weave'],
  'Body': ['head_bob'],
  'Bust': ['bounce', 'puff', 'disdain']
}

let lastMotion = -1

let focusX = 0
let focusY = 0
let v = 0
let maxv = .2
let a = .003

export function updateModel(state: WorldState, dt: number) {

  for (let m of Object.values(state.models.data)) {
    if (m === null) continue

    let screenX = 2 * (-.5 + state.input.x / state.view.width)
    let screenY = 1 * 2 * (.5 - state.input.y / state.view.height)

    // Drag focus effect
    if (lastMotion === -1) {
      // use dt
      let dx = screenX - focusX
      let dy = screenY - focusY
      let d2 = dx * dx + dy * dy
      let damper = d2 < .5 ? d2 * d2 * d2 + .2 : 1
      v = Math.min(maxv * damper, v + a)

      if (d2 < v * v) {
        v = 0
        focusX = screenX
        focusY = screenY
      } else {
        focusX += v * dx / Math.sqrt(d2)
        focusY += v * dy / Math.sqrt(d2)
      }

      // console.log(focusX, focusY)
    }

    m.asset.setParam('ParamAngleX', focusX * 30)
    m.asset.setParam('ParamAngleY', focusY * 30)
    m.asset.setParam('ParamBodyAngleX', focusX * 10)
    m.asset.setParam('ParamBodyAngleY', focusY * 10)


    if (m.asset.physics != null) {
      m.asset.physics.evaluate(m.asset, dt / 2)
      m.asset.physics.evaluate(m.asset, dt / 2)
    }

    m.asset._model.update()
  }

  // for (let m of Object.values(state.models.data)) {
  //   if (m === null) continue

  //   let xId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX)
  //   let yId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY)
  //   let bxId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX)
  //   let byId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleY)

  //   m.asset._model.setParameterValueById(xId, 0)
  //   m.asset._model.setParameterValueById(yId, 0)
  //   m.asset._model.setParameterValueById(bxId, 0)
  //   m.asset._model.setParameterValueById(byId, 0)

  //   // toggle outfits    
  //   m.asset._model.setParameterValueById(CubismFramework.getIdManager().getId('Qipao_Toggle'), 1)
  //   m.asset._model.setParameterValueById(CubismFramework.getIdManager().getId('Priestess_Toggle'), 1)
  //   m.asset._model.setParameterValueById(CubismFramework.getIdManager().getId('Param4'), 1)

  //   // move this to input
  //   let screenX = 2 * (-.5 + state.input.x / state.view.width)
  //   let screenY = 1 * 2 * (.5 - state.input.y / state.view.height)

  //   // hit detection

  //   // for (let i = 0; i < m.asset.setting.getHitAreasCount(); i++) {
  //   //   if (state.input.mouseDown && m.asset.isHit(m.asset.setting.getHitAreaId(i), screenX, screenY)) {

  //   //     if (lastMotion !== -1) {
  //   //       continue
  //   //     }

  //   //     if (m.asset.setting.getHitAreaName(i) === 'Face'
  //   //       || m.asset.setting.getHitAreaName(i) === 'Hair') {
  //   //       lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Face'][Math.floor(3 * Math.random())]], false, 3)
  //   //     } else if (m.asset.setting.getHitAreaName(i) === 'Body') {
  //   //       lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Body'][0]], false, 3)
  //   //     } else if (m.asset.setting.getHitAreaName(i) === 'Bust') {
  //   //       lastMotion = m.asset._motionManager.startMotionPriority(m.asset.motions[reactions['Bust'][bust_cycle++ % 3]], false, 3)
  //   //     }

  //   //     screenX = 0
  //   //     screenY = 0
  //   //     m.asset.setDragging(screenX, screenY)

  //   //     break
  //   //   }
  //   // }

  //   // Drag focus effect
  //   if (lastMotion === -1) {
  //     // use dt
  //     let dx = screenX - focusX
  //     let dy = screenY - focusY
  //     let d2 = dx * dx + dy * dy
  //     let damper = d2 < .5 ? d2 * d2 * d2 + .2 : 1
  //     v = Math.min(maxv * damper, v + a)

  //     if (d2 < v * v) {
  //       v = 0
  //       focusX = screenX
  //       focusY = screenY
  //     } else {
  //       focusX += v * dx / Math.sqrt(d2)
  //       focusY += v * dy / Math.sqrt(d2)
  //     }
  //   }


  //   /*
  //   if (m.asset._breath != null) {
  //     const pid = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath)
  //     m.asset._model.setParameterValueById(pid, 0)
  //     m.asset._breath.updateParameters(m.asset._model, dt)
  //   }

  //   if (m.asset._eyeBlink !== null) {
  //     m.asset._eyeBlink.updateParameters(m.asset._model, dt)
  //   }
  //   */

  //   // if (m.asset._motionManager != null) {

  //   //   if (lastMotion !== -1 && m.asset._motionManager.isFinishedByHandle(lastMotion)) {
  //   //     lastMotion = -1
  //   //   }

  //   //   if (m.asset._motionManager.isFinished()) {
  //   //     m.asset._motionManager.startMotionPriority(state.motions['idle'], false, 3)
  //   //   } else {
  //   //     m.asset._motionManager.updateMotion(m.asset._model, dt)
  //   //   }
  //   // }

  //   m.asset._model.addParameterValueById(xId, focusX * 30)
  //   m.asset._model.addParameterValueById(yId, focusY * 30)
  //   m.asset._model.addParameterValueById(bxId, focusX * 10)
  //   m.asset._model.addParameterValueById(byId, focusY * 10)

  //   // if (m.asset._physics != null) {
  //   //   m.asset._physics.evaluate(m.asset._model, dt)
  //   // }

  //   if (state.external.override) {
  //     m.asset._model.setParameterValueById(xId, 30 * state.external.faceX)
  //     m.asset._model.setParameterValueById(yId, 30 * state.external.faceY)
  //     m.asset._model.setParameterValueById(bxId, 10 * state.external.bodyX)
  //     m.asset._model.setParameterValueById(byId, 10 * state.external.bodyY)
  //   }

  //   m.asset._model.update()

  //   let coreModel = m.asset._model._model
  //   for (let i = 0; i < coreModel.parameters.count; i++) {
  //     let id = coreModel.parameters.ids[i]
  //     let val = coreModel.parameters.values[i]
  //     state.params[id] = val === null ? state.params[id] : val
  //   }
  // }
}