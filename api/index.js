import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const api = axios.create({
  baseURL: 'https://dev.sivanandabahamas.rbgapp.com/api/v1',
  params: {
    token: publicRuntimeConfig.RETREAT_GURU_API_TOKEN
  }
});

export async function get(endpoint, params) {
  const { data } = await api.get(endpoint, { params });

  if (typeof data === 'string') {
    return {
      data: null,
      error: data
    }
  }

  return { data }
};