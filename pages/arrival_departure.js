import React, { Component } from 'react'
import moment from 'moment';
import { defaults, pick } from 'lodash';

import { getPrograms, getRegistrations, SPEAKER_PROGRAM_ID } from '../api';
import ErrorPage from './_error.js'
import ArrivalDeparture from '../components/ArrivalDeparture.js'

export default class ArrivalDeparturePage extends Component {
  static async getInitialProps(context) {
    const query = defaults(pick(context.query, ['program_id', 'min_stay', 'max_stay']), {
      program_id: SPEAKER_PROGRAM_ID,
      min_stay: moment().format('YYYY-MM-DD'),
      max_stay: moment().add(7, 'days').format('YYYY-MM-DD')
    })

    const [programs, registrations] = await Promise.all([
      getPrograms({ id: query.program_id }),
      getRegistrations(query)
    ]);

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