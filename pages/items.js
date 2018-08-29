import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { get } from '../api';

import APIError from '../components/APIError.js'

const JSONView = dynamic(import('react-json-view'), {
  ssr: false
})

export default class Items extends Component {
  static async getInitialProps({ query }) {
    return get('/items', query)
  }

  render() {
    return (
      <div>
        {this.props.error
          ? <APIError error={this.props.error} />
          : <JSONView src={this.props.data} />
        }
      </div>
    )
  }
}