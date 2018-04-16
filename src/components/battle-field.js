import React from 'react'
import { connect } from 'unistore/react'
import './battle-field.sass'
import './field-column.sass'
import Engine from '../engine'

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
        this.engine.setSpeed(this.props.speed || 1)
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
            min='0.1'
            max='10'
            step='0.1'
            value={this.props.speed || 1}
            onChange={this.props.onSpeed}
          />
          <span className='value'>{this.props.speed || 1}x</span>
        </div>
      </div>
    }
  }
)
