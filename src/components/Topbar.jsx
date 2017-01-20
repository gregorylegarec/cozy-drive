import styles from '../styles/topbar'

import React from 'react'

import Toolbar from '../containers/Toolbar'
import Breadcrumb from './Breadcrumb'

const Topbar = ({ folder }) => (
  <div class={styles['fil-content-header']}>
    <Breadcrumb folder={folder} />
    <Toolbar />
  </div>
)

export default Topbar
