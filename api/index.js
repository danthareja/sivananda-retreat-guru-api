import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: publicRuntimeConfig.RETREAT_GURU_API_URL,
  params: {
    token: publicRuntimeConfig.RETREAT_GURU_API_TOKEN
  }
});

export const SPECIAL_GUEST_PROGRAM_ID = 5239;

export async function get(endpoint, params) {
  let data = null;
  let error = null;

  try {
    const response = await api.get(endpoint, { params });
    if (typeof response.data === 'object') {
      data = response.data
    } else {
      error = {
        endpoint,
        params,
        ourMessage: `Expect data type object but got ${typeof response.data}. This is likely an issue with Retreat Guru's API. Try again later, and if this error persists, report this message to Retreat Guru's support team.`,
        theirMessage: response.data
      }
    }
  } catch (e) {
    if (e.response && e.response.data) {
      error = {
        endpoint,
        params,
        ourMessage: `Expected status code 200 but got ${e.response.status}. This is likely an issue on our side. Report this issue to Brahmaswaroop.`,
        theirMessage: e.response.data.error
      }
    } else {
      console.error(e)
      error = {
        endpoint,
        params,
        ourMessage: `This is a catch-all error message for when something very bad happens. Report this issue to Brahmaswaroop.`,
        theirMessage: e.message
      }
    }
  }

  return { data, error }
};

export async function getAll(endpoint, params) {
  return get(endpoint, Object.assign({}, params, { limit: 0 }))
}
