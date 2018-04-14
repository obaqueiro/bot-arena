import React from 'react'
import { connect } from 'unistore/react'
import './tabs-list.sass'

let actions = {
  onSelectTab: (state, activeTab) => ({
    activeTab
  })
}

export default connect('activeTab, tabs', actions)(
  ({ activeTab, tabs, onSelectTab }) => (
    <div className='tabs-list'>
      {
        tabs.map((tab, i) => (
          <button
            className={['tab', activeTab === i ? '-active' : ''].join(' ')}
            onClick={() => onSelectTab(i)}
            key={i}
          >{tab.title}</button>
        ))
      }
    </div>
  )
)
