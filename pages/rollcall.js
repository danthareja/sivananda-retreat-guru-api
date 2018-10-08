import React, { Component } from "react";
import { defaults, pick, omit } from "lodash";

import { getPrograms, getRegistrations } from "../api";
import ErrorPage from "./_error.js";
import Rollcall from "../components/Rollcall.js";

export default class RollcallPage extends Component {
  static async getInitialProps(context) {
    const query = defaults(
      pick(context.query, ["program_id", "blank_columns"]),
      {
        blank_columns: 6
      }
    );

    if (!query.program_id) {
      return {
        error: {
          ourMessage:
            'Expected parameter "program_id" (e.g. /rollcall?program_id=5239)',
          endpoint: "/rollcall",
          params: query
        }
      };
    }

    const [programs, registrations] = await Promise.all([
      getPrograms({ id: query.program_id }),
      getRegistrations(omit(query, ["blank_columns"]))
    ]);

    const error = programs.error || registrations.error;
    if (error) {
      return { error };
    }

    return {
      query,
      program: programs.data[0],
      registrations: registrations.data
    };
  }

  render() {
    const { error, program, registrations, query } = this.props;
    return (
      <div>
        {error ? (
          <ErrorPage error={error} />
        ) : (
          <Rollcall
            program={program}
            registrations={registrations}
            query={query}
          />
        )}
      </div>
    );
  }
}
