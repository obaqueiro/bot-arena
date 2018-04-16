import gen from 'random-seed'
import { MOVE, SHOOT } from './constants'

const doHacks = () => {
  window.Math.random = gen('seed').random

  window.MOVE = (x, y) => ({ type: MOVE, x, y })
  window.SHOOT = (x, y) => ({ type: SHOOT, x, y })
}

doHacks()

export default doHacks
