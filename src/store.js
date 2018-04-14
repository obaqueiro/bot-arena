import createStore from 'unistore'
import defaultBot from './bots/default'
import exampleBot from './bots/example'
import { setupBots } from './bot-helper'

export default createStore({
  activeTab: 0,
  tabs: [
    { title: 'My Bot', code: exampleBot },
    { title: 'CPU Bot', code: defaultBot }
  ],
  bots: setupBots([
    { constructor: Function(exampleBot) }, // eslint-disable-line
    { constructor: Function(defaultBot) } // eslint-disable-line
  ])
})
