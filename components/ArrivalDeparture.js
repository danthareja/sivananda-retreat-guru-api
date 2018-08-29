import React, { Component } from 'react'
import ReactTable from 'react-table';
import moment from 'moment';
import _ from 'lodash';

import 'react-table/react-table.css';

export default class ArrivalDeparture extends Component {
  getTitle() {
    const { query } = this.props;
    return `Special Guests: Arrivals and Departures between ${query.min_stay} and ${query.max_stay}` 
  }

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

  getColorForDay(day) {
    const days = {
      'Monday': {
        hex: '#fea3aa',
        rgb: [254,163,170]
      },
      'Tuesday': {
        hex: '#f8b88b',
        rgb: [248,184,139]
      },
      'Wednesday': {
        hex: '#faf884',
        rgb: [250,248,132]
      },
      'Thursday': {
        hex: '#baed91',
        rgb: [186,237,145]
      },
      'Friday': {
        hex: '#a2f2f0',
        rgb: [162,242,240]
      },
      'Saturday': {
        hex: '#b2cefe',
        rgb: [178,206,254]
      },
      'Sunday': {
        hex: '#f2a2e8',
        rgb: [242,162,232]
      }
    }
    return days[day]
  }



  download() {
    const JSPDF = require('jspdf');
    require('jspdf-autotable');

    const title = this.getTitle();
    const data = this.reactTable.getResolvedState().sortedData;
    const columns = this.getColumns().map(col => ({
      title: col.Header,
      dataKey: col.accessor
    }));

    const totalPagesExp = '{total_pages_count_string}'

    const pageContent = function (data) {
      // HEADER
      doc.setFontSize(14);
      doc.setFontStyle('normal');
      doc.text(title, data.settings.margin.left, 22);

      // FOOTER
      var str = `Page ${data.pageCount} of ${totalPagesExp}`;
      doc.setFontSize(10);
      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    };

    const doc = new JSPDF('landscape');

    doc.autoTable(columns, data, {
      theme: 'grid',
      addPageContent: pageContent,
      margin: { top: 30 },
      createdCell: (cell, data) => {
        cell.styles.fillColor = this.getColorForDay(data.row.raw.day).rgb
      }
    })

    doc.putTotalPages(totalPagesExp);

    doc.save(`${_.snakeCase(title)}.pdf`)
  }


  render() {
    const title = this.getTitle();
    const columns = this.getColumns();
    const data = this.getData();

    return (
      <div>
        <header>
          <h1>{title}</h1>
          <button onClick={() => this.download()}>Download Report</button>
        </header>
        <ReactTable
          ref={el => (this.reactTable = el)}
          data={data}
          columns={columns}
          showPagination={false}
          defaultPageSize={data.length}
          getTrProps={(state, rowInfo, column, instance) => ({
            style: {
              backgroundColor: this.getColorForDay(rowInfo.row.day).hex
            }
          })}
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

