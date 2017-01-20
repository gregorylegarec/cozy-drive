import styles from '../styles/breadcrumb'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'

const Breadcrumb = ({ t, router, folder }) => {
  // extract elements from the pathNames
  // let path = router.location.pathname.match(/\/([^/]*)(.*)/)

  // rootName is the first element before file path
  // const rootName = path[1]

  // the remainder is the file path
  // const filePath = path[2]
  // const filePathElements = path[2].replace(/\/([^/]*)/, '$1').split('/')

  // return (
  //   <h2 class={styles['fil-content-title']}>
  //     { t(`breadcrumb.title_${rootName}`) }
  //   </h2>
  // )
  const isRoot = !folder.dir_id
  const isInRoot = folder.parent && !folder.parent.dir_id

  return (
    <h2 class={styles['fil-content-title']}>
      { t(`breadcrumb.title_files`) }
      { !isRoot && !isInRoot && folder.parent &&
        ` / ${folder.parent.name}` }
      { !isRoot &&
        ` / ${folder.name}` }

    </h2>
  )
}

export default translate()(withRouter(Breadcrumb))
