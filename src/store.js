import createStore from 'unistore'
import defaultBot from './bots/paystandus'
import exampleBot from './bots/default'
import { setupBots } from './bot-helper'

let tabs = [
  { title: 'Challenger', code: exampleBot },
  { title: 'Champion', code: defaultBot }
]
let showReset = false

try {
  let storedTabs = JSON.parse(window.localStorage.getItem('bot-arena-tabs'))
  if (storedTabs && storedTabs.length > 0) {
    tabs = storedTabs
    showReset = true
  }
} catch (err) { console.warn(err) }

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
  .then(bots => store.setState({
    bots,
    tabs: store.getState().tabs.map((tab, i) => ({
      ...tab,
      title: (
        bots[i] &&
        bots[i].object &&
        bots[i].object.name
      ) || 'Unnamed Bot'
    }))
  }))

export default store
