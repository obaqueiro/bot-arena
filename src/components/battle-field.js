import React from 'react'
import { connect } from 'unistore/react'
import './battle-field.sass'
import './field-column.sass'
import Engine from '../engine'

const speeds = [0.1, 0.25, 0.5, 1, 2, 5, 10]

const actions = {
  onSpeed: (_, ev) => ({
    speed: parseFloat(ev.target.value)
  })
}

export default connect('bots,speed', actions)(
  class BattleField extends React.PureComponent {
    componentDidMount () {
      this.setupEngine()
    }

    componentDidUpdate () {
      this.setupEngine()
    }

    setupEngine () {
      if (this.engine) this.engine.dispose()

      try {
        this.engine = Engine(this.props.bots, this.refs.field)
        this.engine.setSpeed(speeds[this.props.speed])
      } catch (_) {}
    }

    render () {
      return <div className='field-column'>
        <div className='battle-field' ref='field'>
          {
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
        <div className='speed'>
          <input
            type='range'
            min='0'
            max='6'
            step='1'
            value={this.props.speed}
            onChange={this.props.onSpeed}
          />
          <span className='value'>Speed: {speeds[this.props.speed]}x</span>
        </div>
      </div>
    }
  }
)
