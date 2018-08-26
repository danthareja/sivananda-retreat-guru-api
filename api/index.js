import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default axios.create({
  baseURL: 'http://dev.sivanandabahamas.rbgapp.com/api/v1',
  params: {
    token: publicRuntimeConfig.RETREAT_GURU_API_TOKEN
  }
});

