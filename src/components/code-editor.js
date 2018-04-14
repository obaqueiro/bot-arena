import React from 'react'
import AceEditor from 'react-ace'
import { connect } from 'unistore/react'
import './code-editor.sass'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import TabsList from './tabs-list'
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

      return { tabs, bots }
    } catch (_) {}
  }
}

export default connect('activeTab,tabs', actions)(
  ({ activeTab, tabs, onChange }) => (
    <div className='code-editor'>
      <div className='top'>
        <code>{'function () {'}</code>
        <TabsList />
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
        <a href='https://github.com/hesselbom/bot-arena'>View source at Github</a>
      </div>
    </div>
  )
)
