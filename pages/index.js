import React from 'react'

export default function Home (){
  return (
    <div>
      <h1>README</h1>
      <p>This site uses data from the Retreat Guru API to build custom functionality.</p>
      <section>
        <h2>API Inspection</h2>
        <p>This site allows you to view data from the Retreat Guru API just by typing in an appropriate url</p>
        <p>There are two parts to the url, <strong>a resource</strong>, and <strong>a query</strong></p>
        <p>A <strong>resource</strong> is a data type that lives in Retreat Guru and is exposed via the API. For example, one such resource is <strong>registrations</strong>.</p>
        <p>To view data for a <strong>resource</strong>, use the resource's name in the url. For example, to view data for <strong>registrations</strong>, use the following url</p>
        <p><a href="/registrations">/registrations</a></p>
        <p>A <strong>query</strong> is a list of additional <strong>parameters</strong> that allow you to filter the response data.</p>
        <p>For example, one allowed <strong>parameter</strong> for the <strong>regisration</strong> resouce is <i>program_id</i></p>
        <p>If you include the <i>program_id</i> in the url, you will only see registrations assigned to that program</p>
        <p><a href="/registrations?program_id=6985">/registrations?program_id=6985</a></p>
        <p>If you want to include multiple <strong>parameters</strong>, separate them with <strong>&</strong></p>
        <p><a href="/registrations?program_id=6985&min_stay=2018-08-28&max_stay=2018-09-09">/registrations?program_id=6985&min_stay=2018-08-28&max_stay=2018-09-09</a></p>
        <p>The following <strong>resources</strong> are supported on this site:</p>
        <ul>
          <li><a href="/items">items</a></li>
          <li><a href="/leads">leads</a></li>
          <li><a href="/payments">payments</a></li>
          <li><a href="/programs">programs</a></li>
          <li><a href="/registrations">registrations</a></li>
          <li><a href="/teachers">teachers</a></li>
          <li><a href="/transactions">transactions</a></li>
        </ul>
        <p>It's up to the Retreat Guru API to define what <strong>parameters</strong> are allowed so refer to <a href="http://dev.sivanandabahamas.rbgapp.com/api">the documentation</a> to see a list of all <strong>resources</strong> and their <strong>parameters</strong></p>
      </section>
      <section>
        <h2>Reports</h2>
        <div>
          <h3>Arrivals and Departures</h3>
          <p>An arrivals and departures report is available at <a href="/arrival_departure">/arrival_departure</a></p>
          <p>By default, it queries the <strong>registrations</strong> resource for all entries between today and seven days from now</p>
          <p>This is customizeable by adding the <i>min_stay</i> and <i>max_stay</i> <strong>parameters</strong>.</p>
          <p>For example, to generate a report for registrations between <strong>2018-08-28</strong> and <strong>2018-09-09</strong>, use the following url</p>
          <p><a href="/arrival_departure?min_stay=2018-08-28&max_stay=2018-09-09">/arrival_departure?min_stay=2018-08-28&max_stay=2018-09-09</a></p>
        </div>
      </section>
    </div>
  )
}
