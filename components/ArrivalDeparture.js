import React, { Component } from 'react'
import ReactTable from 'react-table';
import ReactToPrint from 'react-to-print';
import moment from 'moment';
import _ from 'lodash';

import 'react-table/react-table.css';

export default class ArrivalDeparture extends Component {
  getColumns() {
    return [{
      Header: 'Day',
      accessor: 'day'
    }, {
      Header: 'Direction',
      accessor: 'direction',
    }, {
      Header: 'Name',
      accessor: 'name',
    },{
      Header: 'Room',
      accessor: 'room',
    }, {
      Header: 'Date',
      accessor: 'date',
    },{
      Header: 'Flight Time',
      accessor: 'flightTime',
    }, {
      Header: 'Flight Number',
      accessor: 'flightNumber',
    }, {
      Header: 'Location',
      accessor: 'location',
    }]
  }

  getData() {
    const { query, registrations } = this.props;
    const start = moment(query.min_stay);
    const end = moment(query.max_stay);
    const stayDateRange = [];

    // Get a list of days 
    for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
      stayDateRange.push({
        day: m.format('dddd'),
        ISOString: m.format('YYYY-MM-DD')
      });
    }

    // Transform days into arrival/departure records
    return _.chain(stayDateRange)
      .map(date => {
        const arrivals = registrations
          .filter(r => r.start_date === date.ISOString)
          .map(r => ({
            day: date.day,
            direction: 'Arrival',
            name: r.full_name,
            room: r.room,
            date: date.ISOString,
            flightTime: r.flight_arrival_time_in_nassau_2,
            flightNumber: r.flight_airline_and_flight_number,
            location: r.arriving_by_boat_or_at_the_back_gate,
          }))
        
        const departures = registrations
          .filter(r => r.end_date === date.ISOString)
          .map(r => ({
            day: date.day,
            direction: 'Departure',
            name: r.full_name,
            room: r.room,
            date: date.ISOString,
            flightTime: r.flight_departure_time_from_nassau,
            flightNumber: r.flight_airline_and_flight_number_for_nassau_departure,
            location: r.arriving_by_boat_or_at_the_back_gate,
          }))

        return arrivals.concat(departures)
      })
      .flatten()
      .value()
  }

  getTrProps(state, rowInfo, column, instance) {
    const dayToColor = {
      'Monday': '#fea3aa',
      'Tuesday': '#f8b88b',
      'Wednesday': '#faf884',
      'Thursday': '#baed91',
      'Friday': '#a2f2f0',
      'Saturday': '#b2cefe',
      'Sunday': '#f2a2e8'
    }

    return {
      style: {
        backgroundColor: dayToColor[rowInfo.row.day]
      }
    }
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
          ref={el => (this.componentRef = el)}
          data={data}
          columns={columns}
          showPagination={false}
          defaultPageSize={data.length}
          getTrProps={this.getTrProps}
        />
      </div>
    )
  }
}

