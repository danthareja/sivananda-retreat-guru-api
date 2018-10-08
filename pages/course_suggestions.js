import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import moment from 'moment';
import { assign, flatten } from 'lodash';
import ErrorPage from './_error.js'

import { getCourses, getRegistrations, getRegistrationsWithoutCourse, getAvailableCoursesForRegistration } from '../api';

const JSONView = dynamic(import('react-json-view'), {
  ssr: false
});

// Guests that don't have any registration for a course
// if there is a course during their stay?
export default class CourselessPage extends Component {
  static async getInitialProps(context) {
    const query = assign({
      min_stay: moment().format('YYYY-MM-DD'),
      max_stay: moment().add(7, 'days').format('YYYY-MM-DD')
    }, context.query)

    const [registrations, courses] = await Promise.all([
      getRegistrations(query),
      getCourses(query),
    ]);

    const error = registrations.error || courses.error;
    if (error) {
      return { error }
    }

    return {
      query,
      error,
      registrations: getRegistrationsWithoutCourse(registrations.data)
        .map(registration => {
          return {
            registration,
            availableCourses: getAvailableCoursesForRegistration(courses.data, registration)
          }
        })
    }
  }

  render() {
    const { error, registrations, query } = this.props;
    return (
      <div>
        {error
          ? <ErrorPage error={error} />
          : <JSONView src={registrations}/>
        }
      </div>
    )
  }
}