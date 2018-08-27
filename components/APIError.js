import React from 'react'

export default function APIError({ error }) {
  return (
    <div>
      <h1>API Error</h1>
      <p>Unexpected response from Retreat Guru API. Please report this error to their support team.</p>
      <div dangerouslySetInnerHTML={{ __html: error }}></div>
    </div>
  )
}