import React, { Component } from 'react'
import ReactTable from 'react-table';
import ReactToPrint from 'react-to-print';
import _ from 'lodash';

import 'react-table/react-table.css';

export default class Rollcall extends Component {
  getColumns() {
    const { query, program } = this.props;

    const title = program.start_date && program.end_date
      ? `${program.name} from ${program.start_date} to ${program.end_date}`
      : program.name
    
    const columns = [{
      Header: 'Name',
      accessor: 'full_name'
    }]

    _.times(query.blank_columns, n => {
      columns.push({
        id: `blankColumn${n}`,
        Header: '',
        accessor: () => '',
        sortable: false
      })
    })

    return [{
      Header: title,
      columns
    }];
  }

  getData() {
    return this.props.registrations;
  }

  render() {
    const data = this.getData();
    const columns = this.getColumns();

    return (
      <div>
        <ReactToPrint
          trigger={() => <button>Print report</button>}
          content={() => this.componentRef}
        />
        <ReactTable
          className="-striped"
          ref={el => (this.componentRef = el)}
          data={data}
          columns={columns}
          showPagination={false}
          defaultPageSize={data.length}
        />
      </div>
    )
  }
}

