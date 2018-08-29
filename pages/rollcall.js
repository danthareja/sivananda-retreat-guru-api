import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { get } from '../api';
import _ from 'lodash';

import APIError from '../components/APIError.js'
import Rollcall from '../components/Rollcall.js'

export default class RollcallPage extends Component {
  static DEFAULT_BLANK_COLUMNS = 6

  static async getInitialProps({ query }) {
    // Assign default query parameters
    query = Object.assign({
      blank_columns: RollcallPage.DEFAULT_BLANK_COLUMNS, 
    }, query)

    const { error, data } = await get('/registrations', _.omit(query, ['blank_columns']))

    return {
      query,
      error,
      data
    }
  }

  render() {
    return (
      <div>
        {this.props.error
          ? <APIError error={this.props.error} />
          : <Rollcall registrations={this.props.data} query={this.props.query} />
        }
      </div>
    )
  }
}