import React, { Component } from 'react'
import ReactTable from 'react-table';
import { times, snakeCase, trim } from 'lodash';

import 'react-table/react-table.css';

export default class CourseSuggestions extends Component {
  getTitle() {
    const { query } = this.props;
    return `Course suggestions for guests between ${query.min_stay} and ${query.max_stay}`
  }

  getColumns() {
    return [{
      Header: 'Name',
      accessor: 'full_name',
      maxWidth: 200
    },{
      Header: 'Arrival',
      accessor: 'start_date',
      maxWidth: 100
    },{
      Header: 'Departure',
      accessor: 'end_date',
      maxWidth: 100
    },{
      Header: 'Eligible Courses',
      accessor: 'courses',
      Cell: CoursesCell
    }]
  }

  getData() {
    return this.props.registrations;
  }

  render() {
    const title = this.getTitle();
    const columns = this.getColumns();
    const data = this.getData();

    return (
      <div>
        <header>
          <h1>{title}</h1>
        </header>
        <ReactTable
          className="-striped"
          ref={el => (this.reactTable = el)}
          data={data}
          columns={columns}
          showPagination={false}
          defaultPageSize={data.length}
        />
        <style jsx>{`
          header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          header h1 {
            font-size: 18px;
            display: block;
          }
          header button {
            display: block;
            font-size: 14px;
          }
        `}</style>
      </div>
    )
  }
}

function CoursesCell({ row }) {
  return (
    <ul>
      {row.courses.map(course => (
        <li><a target="_blank" href={course.program_link}>{course.name}</a></li>
      ))}
    </ul>
  )
}

