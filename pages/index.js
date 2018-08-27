import React from 'react'

export default function Home (){
  return (
    <div>
      <h1>Retreat Guru API</h1>
      <p>This is basically just a web version of CURL. For example:</p>
      <ul>
        <li>
          <a href="/programs">all programs</a>
        </li>
        <li>
          <a href="/programs?id=6979">program with id 6979</a>
        </li>
        <li>
          <a href="/registrations">all registrations</a>
        </li>
        <li>
          <a href="/registrations?id=1">registration with id 1</a>
        </li>
        <li>
          <a href="/transactions">all transactions</a>
        </li>
        <li>
          <a href="/transactions?id=1">transaction with id 1</a>
        </li>
      </ul>
      <p>All query parameters in the resource's URL are passed directly to Retreat Guru's API, so more complex queries should work</p>
    </div>
  )
}
