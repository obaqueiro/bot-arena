import React from 'react'
import { connect } from 'unistore/react'
import './battle-field.sass'
import Engine from '../engine'

export default connect('bots')(
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
      } catch (_) {}
    }

    render () {
      return <div className='battle-field' ref='field'>
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
    }
  }
)
