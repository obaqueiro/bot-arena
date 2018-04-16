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

const store = createStore({
  activeTab: 0,
  speed: 3,
  tabs,
  showReset,
  bots: []
})

setupBots(tabs.map(tab => ({
  constructor: Function(tab.code) // eslint-disable-line
})))
  .then(bots => store.setState({ bots }))

export default store
