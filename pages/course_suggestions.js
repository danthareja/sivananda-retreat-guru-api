import React, { Component } from "react";
import dynamic from "next/dynamic";
import moment from "moment";
import { defaults, pick } from "lodash";

import {
  getCourses,
  getRegistrations,
  getRegistrationsWithoutCourse,
  getAvailableCoursesForRegistration
} from "../api";
import ErrorPage from "./_error.js";
import CourseSuggestions from "../components/CourseSuggestions.js";

export default class CourseSuggestionsPage extends Component {
  static async getInitialProps(context) {
    const query = defaults(pick(context.query, ["min_stay", "max_stay"]), {
      min_stay: moment().format("YYYY-MM-DD"),
      max_stay: moment()
        .add(1, "months")
        .format("YYYY-MM-DD")
    });

    const [registrations, courses] = await Promise.all([
      getRegistrations(query),
      getCourses(query)
    ]);

    const error = registrations.error || courses.error;
    if (error) {
      return { error };
    }

    return {
      query,
      registrations: getRegistrationsWithoutCourse(registrations.data)
        .map(registration => {
          return {
            ...registration,
            courses: getAvailableCoursesForRegistration(
              courses.data.filter(c => c.public),
              registration
            )
          };
        })
        .filter(registration => registration.courses.length > 0)
    };
  }

  render() {
    const { error, registrations, query } = this.props;
    return (
      <div>
        {error ? (
          <ErrorPage error={error} />
        ) : (
          <CourseSuggestions query={query} registrations={registrations} />
        )}
      </div>
    );
  }
}
