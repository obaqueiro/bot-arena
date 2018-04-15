import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'unistore/react'
import 'outline.js'
import './index.sass'
import './bot-arena.sass'
import './hacks'
import store from './store'
import CodeEditor from './components/code-editor'
import BattleField from './components/battle-field'

const Arena = () => (
  <Provider store={store}>
    <div className='bot-arena'>
      <CodeEditor />
      <BattleField />
    </div>
  </Provider>
)

render(<Arena />, document.getElementById('app'))

// Trigger resize to fix Ace Editor scrolling
setTimeout(() => (
  window.dispatchEvent(new window.Event('resize'))
), 500)
