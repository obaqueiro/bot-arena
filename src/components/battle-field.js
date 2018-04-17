import React from 'react'
import { connect } from 'unistore/react'
import shallowCompare from 'shallow-compare'
import './battle-field.sass'
import './field-column.sass'
import Engine from '../engine'

const speeds = [0.1, 0.25, 0.5, 1, 2, 5, 10]

const actions = {
  onSpeed: (_, ev) => ({
    speed: parseFloat(ev.target.value)
  })
}

const SpeedRange = connect('speed', actions)(({speed, onSpeed}) => (
  <div className='speed'>
    <input
      type='range'
      min='0'
      max='6'
      step='1'
      value={speed}
      onChange={onSpeed}
    />
    <span className='value'>Speed: {speeds[speed]}x</span>
  </div>
))

export default connect('bots,speed')(
  class BattleField extends React.Component {
    componentDidMount () {
      this.setupEngine()
    }

    componentDidUpdate () {
      this.setupEngine()
    }

    shouldComponentUpdate (nextProps, nextState) {
      // Hack to not update if only speed is updated
      let me = { props: { ...this.props }, state: {} }
      if (nextProps.speed !== me.props.speed) {
        me.props.speed = nextProps.speed

        // Only update engine speed
        this.engine.setSpeed(speeds[nextProps.speed])
      }

      return shallowCompare(me, nextProps, nextState)
    }

    setupEngine () {
      if (this.engine) this.engine.dispose()

      try {
        this.engine = Engine(this.props.bots, this.refs.field)
        this.engine.setSpeed(speeds[this.props.speed])
      } catch (err) { console.warn(err) }
    }

    render () {
      return <div className='field-column'>
        <div className='battle-field' ref='field'>
          {
            this.props.bots &&
            this.props.bots.map(bot => (
              <div
                className='bot'
                key={bot.key}
                ref={el => { bot.dom = el }}
                style={{
                  backgroundImage: bot.object && bot.object.image && `url(${bot.object.image})`
                }}
              >
                <div className='health'>
                  <div className='bar' ref={el => { bot.healthDom = el }} />
                </div>
              </div>
            ))
          }
        </div>
        <SpeedRange />
      </div>
    }
  }
)
