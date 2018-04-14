import React from 'react'
import AceEditor from 'react-ace'
import { connect } from 'unistore/react'
import './code-editor.sass'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import TabsList from './tabs-list'
import defaultBot from '../bots/default'
import exampleBot from '../bots/example'
import { setupBots } from '../bot-helper'

const onLoad = (editor) => {
  editor.session.$worker.call('changeOptions', [{asi: true}])
}

const actions = {
  onChange: (state, index, value) => {
    try {
      const tabs = state.tabs.map((tab, i) => (
        i === index
          ? { ...tab, code: value }
          : tab
      ))
      const bots = setupBots(tabs.map(tab => ({
        constructor: Function(tab.code) // eslint-disable-line
      })))

      // Set title to bot name if found
      tabs.forEach((tab, i) => {
        tab.title = (
          bots[i] &&
          bots[i].object &&
          bots[i].object.name
        ) || 'Unnamed Bot'
      })

      window.localStorage.setItem(
        'bot-arena-tabs',
        JSON.stringify(tabs)
      )

      return { tabs, bots, showReset: true }
    } catch (_) {}
  },
  onReset: () => {
    if (window.confirm('This will reset to default code, are you sure you want that?')) {
      window.localStorage.removeItem('bot-arena-tabs')

      return {
        tabs: [
          { title: 'My Bot', code: exampleBot },
          { title: 'CPU Bot', code: defaultBot }
        ],
        bots: setupBots([
          { constructor: Function(exampleBot) }, // eslint-disable-line
          { constructor: Function(defaultBot) } // eslint-disable-line
        ]),
        showReset: false
      }
    }
  }
}

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
        <a href='https://github.com/hesselbom/bot-arena'>View source on Github</a>
      </div>
    </div>
  )
)
