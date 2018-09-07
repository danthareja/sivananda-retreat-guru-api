import React, { Component } from 'react'
import moment from 'moment';
import { get, getAll } from '../api';

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

    const [programs, registrations] = await Promise.all([
      get('/programs', { id: query.program_id }),
      getAll('/registrations', query),
    ]);

    // Validate responses
    const error = programs.error || registrations.error
    if (error) {
      return { error }
    }

    return {
      query,
      program: programs.data[0],
      registrations: registrations.data,
    }
  }

  render() {
    const { error, program, registrations, query } = this.props;
    return (
      <div>
        {error
          ? <APIError error={error} />
          : <ArrivalDeparture program={program} registrations={registrations} query={query} />
        }
      </div>
    )
  }
}