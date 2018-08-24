import React, { Component } from 'react'

import { initBar } from 'drive/mobile/lib/cozy-helper'

import Wizard from './components/Wizard'
import Files from './components/Files'
import BackupPhotosVideos from './components/BackupPhotosVideos'
import Analytics from './components/Analytics'

export default class OnBoarding extends Component {
  onboardingSteps = [Files, BackupPhotosVideos, Analytics]

  redirectToApp() {
    initBar(this.context.client)
    this.props.router.replace('/')
  }

  render() {
    return (
      <Wizard
        steps={this.onboardingSteps}
        onComplete={() => this.redirectToApp()}
      />
    )
  }
}