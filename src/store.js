import createStore from 'unistore'
import defaultBot from './bots/default'
import exampleBot from './bots/example'
import { setupBots } from './bot-helper'

let tabs = [
  { title: 'My Bot', code: exampleBot },
  { title: 'CPU Bot', code: defaultBot }
]
let showReset = false

try {
  let storedTabs = JSON.parse(window.localStorage.getItem('bot-arena-tabs'))
  if (storedTabs && storedTabs.length > 0) {
    tabs = storedTabs
    showReset = true
  }
} catch (_) {}

export default createStore({
  activeTab: 0,
  tabs,
  showReset,
  bots: setupBots([
    { constructor: Function(exampleBot) }, // eslint-disable-line
    { constructor: Function(defaultBot) } // eslint-disable-line
  ])
})
