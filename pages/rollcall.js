import React, { Component } from 'react'
import { get, getAll } from '../api';
import { omit, assign } from 'lodash';

import ErrorPage from './_error.js'
import Rollcall from '../components/Rollcall.js'

export default class RollcallPage extends Component {
  static async getInitialProps(context) {
    // Check required parameters
    if (!context.query.program_id) {
      return {
        error: {
          ourMessage: 'Expected parameter "program_id" (e.g. /rollcall?program_id=5239)',
          endpoint: '/rollcall',
          params: query
        }
      }
    }

    // Assign default query parameters
    const query = assign({
      blank_columns: 6,
    }, context.query)

    // Query Retreat Guru
    const [programs, registrations] = await Promise.all([
      get('/programs', { id: query.program_id }),
      getAll('/registrations', {
        program_id: query.program_id
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
      registrations: registrations.data,
    }
  }

  render() {
    const { error, program, registrations, query } = this.props;
    return (
      <div>
        {error
          ? <ErrorPage error={error} />
          : <Rollcall program={program} registrations={registrations} query={query} />
        }
      </div>
    )
  }
}