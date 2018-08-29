import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: publicRuntimeConfig.RETREAT_GURU_API_URL,
  params: {
    token: publicRuntimeConfig.RETREAT_GURU_API_TOKEN
  }
});

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
        ourMessage: `Expect data type object but got ${typeof response.data}. This is likely an internal error on their side.`,
        theirMessage: response.data
      }
    }
  } catch (e) {
    if (e.response && e.response.data) {
      error = {
        endpoint,
        params,
        ourMessage: `Expected status code 200 but got ${e.response.status}. This is likely a fixable issue.`,
        theirMessage: e.response.data.error
      }
    } else {
      console.error(e)
      error = {
        endpoint,
        params,
        ourMessage: `This is a catch-all error message for when something bad happens. Ask Brahmaswaroop to check the logs.`,
        theirMessage: e.message
      }
    }
  }

  return { data, error }
};