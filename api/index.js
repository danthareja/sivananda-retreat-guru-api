import { flatten, groupBy, pickBy, values } from "lodash";
import axios from "axios";
import moment from "moment";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: publicRuntimeConfig.RETREAT_GURU_API_URL,
  params: {
    token: publicRuntimeConfig.RETREAT_GURU_API_TOKEN
  }
});

export const SPEAKER_PROGRAM_ID = 5239;
export const YVP_PROGRAM_ID = 5237;

// This is a list of all program categories available in Retreat Guru
// and their appropriate identifiers to be used in queries
//
// As of now, I am not aware of any automated way to generate this list,
// so care should be taken to keep it updated, along with any references
// in this codebase
//
// Karma Yoga: ky
// Experiential Course: course
//   Professional Training: pt
//   Sivananda Core Course: scc
// Lodging Based
//   Advanced Teacher Training Course: attc
//   Children: children
//   Speaker: speaker
//   Teacher Training Course: ttc
//   YVP: yvp-lodging
// Yoga Vacation Program: yvp
//   Special Event: special

export function getRegistrationsWithoutCourse(registrations) {
  return flatten(
    values(
      pickBy(
        groupBy(registrations, "full_name"),
        registrations =>
          registrations.length === 1 &&
          registrations[0].program_id ===
            YVP_PROGRAM_ID(
              // "reserved" "pending" "need-approval" "unconfirmed" "cancelled" "arrived" "checked-out" "duplicate"
              registrations[0].status === "arrived" ||
                registrations[0].status === "reserved"
            )
      )
    )
  );
}

export function getAvailableCoursesForRegistration(courses, registration) {
  return courses.filter(course => {
    return (
      moment(registration.start_date).isSameOrBefore(
        course.start_date,
        "day"
      ) && moment(registration.end_date).isSameOrAfter(course.end_date, "day")
    );
  });
}

export async function getCourses({ min_stay, max_stay }) {
  return getAll("/programs", {
    category: "course,pt,scc,attc,ttc",
    min_date: min_stay,
    max_date: max_stay
  });
}

export async function getRegistrations({ program_id, min_stay, max_stay }) {
  return getAll("/registrations", {
    program_id,
    min_stay,
    max_stay
  });
}

export async function getPrograms({ id }) {
  return get("/programs", { id });
}

export async function getAll(endpoint, params) {
  return get(endpoint, Object.assign({}, params, { limit: 0 }));
}

export async function get(endpoint, params) {
  let data, error;

  try {
    const response = await api.get(endpoint, { params });
    if (typeof response.data === "object") {
      data = response.data;
    } else {
      error = {
        endpoint,
        params,
        ourMessage: `Expect data type object but got ${typeof response.data}. This is likely an issue with Retreat Guru's API. Try again later, and if this error persists, report this message to Retreat Guru's support team.`,
        theirMessage: response.data
      };
    }
  } catch (e) {
    if (e.response && e.response.data) {
      error = {
        endpoint,
        params,
        ourMessage: `Expected status code 200 but got ${
          e.response.status
        }. This is likely an issue on our side. Report this issue to Brahmaswaroop.`,
        theirMessage: e.response.data.error
      };
    } else {
      console.error(e);
      error = {
        endpoint,
        params,
        ourMessage: `This is a catch-all error message for when something very bad happens. Report this issue to Brahmaswaroop.`,
        theirMessage: e.message
      };
    }
  }

  return { data, error };
}
