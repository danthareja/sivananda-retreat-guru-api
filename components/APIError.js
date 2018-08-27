import React from 'react'

export default function Error({ error }) {
  return (
    <div>
      <h1>API Error</h1>
      <p>Unexpected value returned from Retreat Guru API. Please report this stack trace to support.</p>
      <div dangerouslySetInnerHTML={{ __html: error }}></div>
    </div>
  )
}