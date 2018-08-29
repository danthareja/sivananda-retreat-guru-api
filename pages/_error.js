import React, { Component } from 'react'
import HTTPStatus from 'http-status'
import Head from 'next/head'

export default class Error extends Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props;
    const title = statusCode === 404
      ? 'This page could not be found'
      : HTTPStatus[statusCode] || 'An unexpected error has occurred';

    return (
      <div>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <title>{statusCode}: {title}</title>
        </Head>
        <div>
          <h1>Error</h1>
          <p>{statusCode}: {title}</p>
        </div>
      </div>
    )
  }
}