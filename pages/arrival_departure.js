import React, { Component } from 'react'
import moment from 'moment';
import { get, getAll, SPECIAL_GUEST_PROGRAM_ID } from '../api';
import { assign } from 'lodash';

import ErrorPage from './_error.js'
import ArrivalDeparture from '../components/ArrivalDeparture.js'

export default class ArrivalDeparturePage extends Component {
  static async getInitialProps(context) {
    // Assign default query parameters
    const query = assign({
      program_id: SPECIAL_GUEST_PROGRAM_ID,
      min_stay: moment().format('YYYY-MM-DD'),
      max_stay: moment().add(7, 'days').format('YYYY-MM-DD')
    }, context.query)

    // Query Retreat Guru
    const [programs, registrations] = await Promise.all([
      get('/programs', { id: query.program_id }),
      getAll('/registrations', {
        program_id: query.program_id,
        min_stay: query.min_stay,
        max_stay: query.max_stay
      }),
    ]);


    // Validate responses
    const error = programs.error || registrations.error
    if (error) {
      return { error }
    }

    return {
      query,
      program: programs.data[0],
      registrations: registrations.data.filter(registration => registration.status !== 'cancelled'),
    }
  }

  render() {
    const { error, program, registrations, query } = this.props;
    return (
      <div>
        {error
          ? <ErrorPage error={error} />
          : <ArrivalDeparture program={program} registrations={registrations} query={query} />
        }
      </div>
    )
  }
}