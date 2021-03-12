import React from 'react'
import AceEditor from 'react-ace'
import { connect } from 'unistore/react'
import './code-editor.sass'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import TabsList from './tabs-list'
import defaultBot from '../bots/paystandus'
import exampleBot from '../bots/default'
import { setupBots } from '../bot-helper'

const onLoad = (editor) => {
  editor.session.$worker.call('changeOptions', [{asi: true}])
}

const actions = store => ({
  onChange: async (state, index, value) => {
    try {
      let tabs = state.tabs.map((tab, i) => (
        i === index
          ? { ...tab, code: value }
          : tab
      ))

      store.setState({ tabs })

      window.localStorage.setItem(
        'bot-arena-tabs',
        JSON.stringify(tabs)
      )

      const bots = await setupBots(tabs.map(tab => ({
        constructor: Function(tab.code) // eslint-disable-line
      })))

      // Set title to bot name if found
      // Fetch tabs from state if updated during bots promise
      tabs = store.getState().tabs
      tabs = tabs.map((tab, i) => ({
        ...tab,
        title: (
          bots[i] &&
          bots[i].object &&
          bots[i].object.name
        ) || 'Unnamed Bot'
      }))

      window.localStorage.setItem(
        'bot-arena-tabs',
        JSON.stringify(tabs)
      )

      store.setState({ tabs, bots, showReset: true })
    } catch (err) { console.warn(err) }
  },
  onReset: async () => {
    if (window.confirm('This will reset to default code, are you sure you want that?')) {
      window.localStorage.removeItem('bot-arena-tabs')

      return {
        tabs: [
          { title: 'Challenger', code: exampleBot },
          { title: 'Champion', code: defaultBot }
        ],
        bots: await setupBots([
          { constructor: Function(exampleBot) }, // eslint-disable-line
          { constructor: Function(defaultBot) } // eslint-disable-line
        ]),
        showReset: false
      }
    }
  }
})

export default connect('activeTab,tabs,showReset', actions)(
  ({ activeTab, tabs, showReset, onChange, onReset }) => (
    <div className='code-editor'>
      <div className='top'>
        <code>{'function () {'}</code>
        <TabsList />
        { showReset && <button className='reset' onClick={onReset}>Reset</button> }
      </div>
      <div className={`editor -active${activeTab}`}>
        {
          tabs.map((tab, i) => (
            <AceEditor
              key={`bot-editor-${i}`}
              name={`bot-editor-${i}`}
              mode='javascript'
              theme='monokai'
              width='100%'
              height='100%'
              onLoad={onLoad}
              onChange={value => onChange(i, value)}
              fontSize={14}
              value={tab.code}
              setOptions={{
                tabSize: 2
              }}
              editorProps={{
                $blockScrolling: Infinity
              }}
            />
          ))
        }
      </div>
      <div className='bottom'>
        <code>{'}'}</code>
        <a href='https://github.com/hesselbom/bot-arena'>View Original Source on Github. Modified by Paystand</a>
      </div>
    </div>
  )
)
