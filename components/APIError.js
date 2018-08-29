import React from 'react'

export default function APIError({ error }) {
  return (
    <div>
      <h1>API Error</h1>
      <p>{error.ourMessage}</p>
      <p><code>{error.theirMessage}</code></p>
      <ul>
        <li>endpoint: {error.endpoint}</li>
        <li>params: {JSON.stringify(error.params)}</li>
      </ul>
    </div>
  )
}