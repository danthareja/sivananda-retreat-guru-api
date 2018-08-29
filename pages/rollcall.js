import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { get, getAll } from '../api';
import _ from 'lodash';

import APIError from '../components/APIError.js'
import Rollcall from '../components/Rollcall.js'

export default class RollcallPage extends Component {
  static DEFAULT_BLANK_COLUMNS = 6

  static async getInitialProps({ query }) {
    // Check required parameters
    if (!query.program_id) {
      return {
        error: {
          ourMessage: 'Expected parameter "program_id" (e.g. /rollcall?program_id=6985)',
          endpoint: '/rollcall',
          params: query
        }
      }
    }

    // Assign default query parameters
    query = Object.assign({
      blank_columns: RollcallPage.DEFAULT_BLANK_COLUMNS, 
    }, query)

    // Query Retreat Guru
    const [programs, registrations] = await Promise.all([
      get('/programs', { id: query.program_id }),
      get('/registrations', _.omit(query, ['blank_columns'])),
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
          ? <APIError error={this.props.error} />
          : <Rollcall registrations={this.props.registrations} program={this.props.program} query={this.props.query} />
        }
      </div>
    )
  }
}