import React from 'react'
import Link from 'next/link'

const Home = () => (
  <div>
    <h1>Retreat Guru API</h1>
    <p>This is basically just a web version of CURL. For example:</p>
    <ul>
      <li>
        <Link prefetch href="/programs"><a>all programs</a></Link>
      </li>
      <li>
        <Link prefetch href="/programs?id=6979"><a>program with id 6979</a></Link>
      </li>
      <li>
        <Link prefetch href="/registrations"><a>all registrations</a></Link>
      </li>
      <li>
        <Link prefetch href="/registrations?id=1"><a>registration with id 1</a></Link>
      </li>
      <li>
        <Link prefetch href="/transactions"><a>all transactions</a></Link>
      </li>
      <li>
        <Link prefetch href="/transactions?id=1"><a>transaction with id 1</a></Link>
      </li>
    </ul>
    <p>All query parameters in the resource's URL are passed directly to Retreat Guru's API, so more complex queries should work</p>
  </div>
)

export default Home
