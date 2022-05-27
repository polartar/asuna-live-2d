import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../store/hooks'
import { store } from '../store/store'
import { DialogueActions } from '../store/dialogue'

import styles from './Dialogue.module.scss'
import { parse, stageSetting } from './DialogueUtil'

const texts: string[] = require('./texts.json')
const parsed = parse(texts)
const stages: stageSetting[] = [
  { big: true },
  { hand: true },
  { smile: true },
  { hand: true },
  { smile: true, hand: true, big: true }
]


function Dialogue() {
  const dispatch = useDispatch()
  const { stage, startTime } = useAppSelector(state => state.dialogue)
  const [timer, setTimer] = useState(0) // time elapsed since stage start in ms + offset
  const [offset, setOffset] = useState(0)
  const [hide, setHide] = useState(false)
  const chars = parsed[stage]
  const settings = stages[stage]
  const finished = chars[chars.length - 1].time < timer
  const last = stage === stages.length - 1

  const opacityClass = hide ? ' hide' : ''
  const arrowClass = finished ? '' : ' hidden'
  const handClass = settings.hand === true ? '' : ' hide'
  const smileClass = settings.smile === true ? '' : ' hide'
  const bigClass = settings.big === true ? ' big' : ''

  useEffect(() => {
    let stop = false
    let id: number

    const step = () => {
      setTimer(Date.now() - store.getState().dialogue.startTime + offset)

      if (stop === false) {
        id = requestAnimationFrame(step)
      }
    }

    id = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(id)
      stop = true
    }
  })

  const handleNext = () => {
    if (last && finished) {
      setHide(true)
    } else if (finished) {
      setOffset(0)
      dispatch(DialogueActions.setStage(stage + 1))
      dispatch(DialogueActions.setTime(Date.now()))
    } else {
      setOffset(120 * 1000)
    }
  }

  return <div className={`${styles['dialogue']}${opacityClass}`}>
    <div className='textbox' >
      <div className='box'></div>
      <div className='name'>Goddess</div>
      <div className={`hand${handClass}`}></div>
      <div className='avatar'></div>
      <div className={`smile${smileClass}`}></div>
      <div className={`text${bigClass}`} onClick={handleNext}>
        <div className={`arrow${arrowClass}`}></div>
        {chars.map(letter => {
          const opacityClass = timer >= letter.time ? ' show' : ''
          const letterClass = timer >= letter.time ? letter.class : ''

          return <i
            key={letter.id}
            className={`${letterClass}${opacityClass}`}
          >
            {letter.char}
          </i>
        })
        }
      </div>
    </div>
  </div>
}

export default Dialogue
