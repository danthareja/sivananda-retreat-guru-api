import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { getAll } from '../api';
import moment from 'moment';

import APIError from '../components/APIError.js'
import ArrivalDeparture from '../components/ArrivalDeparture.js'

export default class ArrivalDeparturePage extends Component {
  static PROGRAM_ID = 6985

  static async getInitialProps({ query }) {
    // Assign default query parameters
    query = Object.assign({
      program_id: ArrivalDeparturePage.PROGRAM_ID,
      min_stay: moment().format('YYYY-MM-DD'),
      max_stay: moment().add(7, 'days').format('YYYY-MM-DD')
    }, query)

    const { error, data } = await getAll('/registrations', query)

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
          : <ArrivalDeparture registrations={this.props.data} query={this.props.query} />
        }
      </div>
    )
  }
}