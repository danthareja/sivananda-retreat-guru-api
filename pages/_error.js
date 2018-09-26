import React, { Component } from 'react'
import NextError from 'next/error'

export default class Error extends Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    const { statusCode, error } = this.props;

    // Our Error
    if (error) {
      return (
        <div>
          <h1>API Error</h1>
          <p>{error.ourMessage}</p>
          <p><code>{error.theirMessage}</code></p>
          <ul>
            <li>endpoint: {error.endpoint}</li>
            <li>params: {JSON.stringify(error.params)}</li>
          </ul>
        </div>
      )
    }

    return (
      <NextError statusCode={this.props.statusCode} />
    )
  }
}