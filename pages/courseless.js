import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import moment from 'moment';
import { get, getAll } from '../api';
import { assign, flatten } from 'lodash';

import ErrorPage from './_error.js'

const JSONView = dynamic(import('react-json-view'), {
  ssr: false
});

// Guests that don't have any registration for a course
// if there is a course during their stay?
export default class CourselessPage extends Component {
  static async getInitialProps(context) {
    // Assign default query parameters
    const query = assign({
      min_stay: moment().format('YYYY-MM-DD'),
      max_stay: moment().add(7, 'days').format('YYYY-MM-DD')
    }, context.query)

    // YVP programs are identifiable be the "YVP" category
    // Course programs are identifiable by the "Experiential Course" category
    const [yvps, courses] = await Promise.all([
      getAll('/programs', {
        category: 'YVP'
      }),
      getAll('/programs', {
        category: 'Experiential Course',
        min_date: query.min_stay,
        max_date: query.max_stay,
      }),
    ]);

    // Validate responses
    const error = yvps.error || courses.error;
    if (error) {
      return { error }
    }

    // For each YVP program, 
    // Find all registrations and their eligible courses
    let registrations = [];

    for (let yvp in yvps.data) {
      const _registrations = await get('/registrations', {
        program_id: yvp.id,
        min_stay: query.min_stay,
        max_stay: query.max_stay
      });

      // Validate responses
      const error = _registrations.error;
      if (error) {
        return { error }
      }

      const registrationsWithCourses = _registrations.map(registration => ({
        registration,
        eligibleCourses: courses.filter(course =>
          moment(registration.start_date).isSameOrBefore(course.start_date, 'day') &&
          moment(registration.end_date).isSameOrAfter(course.end_date, 'day')
        )
      }));

      registrations = registrations.concat(registrationsWithCourses);
    }


    return {
      query,
      registrations
    }
  }

  render() {
    const { error, registrations, query } = this.props;
    return (
      <div>
        {error
          ? <ErrorPage error={error} />
          : <JSONView src={this.props}/>
        }
      </div>
    )
  }
}