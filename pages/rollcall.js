import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { get, getAll } from '../api';
import { omit, assign } from 'lodash';

import ErrorPage from './_error.js'
import Rollcall from '../components/Rollcall.js'

export default class RollcallPage extends Component {
  static BLANK_COLUMNS = 6

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
      blank_columns: RollcallPage.BLANK_COLUMNS, 
    }, context.query)

    // Query Retreat Guru
    const [programs, registrations] = await Promise.all([
      get('/programs', { id: query.program_id }),
      getAll('/registrations', omit(query, ['blank_columns'])),
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
    return (
      <div>
        {this.props.error
          ? <ErrorPage error={this.props.error} />
          : <Rollcall registrations={this.props.registrations} program={this.props.program} query={this.props.query} />
        }
      </div>
    )
  }
}