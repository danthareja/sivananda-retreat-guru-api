import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import api from '../api';

const JSONView = dynamic(import('react-json-view'), {
  ssr: false
})

export default class Program extends Component {
  static async getInitialProps({ query }) {
    const { data } = await api.get('/teachers', {
      params: query
    })
    return { data }
  }

  render() {
    return (
      <div>
        <JSONView src={this.props.data} />
      </div>
    )
  }
}