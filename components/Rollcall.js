import React, { Component } from "react";
import ReactTable from "react-table";
import { times, snakeCase, trim } from "lodash";

import "react-table/react-table.css";

export default class Rollcall extends Component {
  getTitle() {
    const { program } = this.props;
    let title = `Rollcall: ${program.name}`;
    if (program.start_date && program.end_date) {
      title += ` from ${program.start_date} to ${program.end_date}`;
    }
    return title;
  }

  getColumns() {
    const { query, program } = this.props;

    const title =
      program.start_date && program.end_date
        ? `${trim(program.name)} from ${program.start_date} to ${
            program.end_date
          }`
        : trim(program.name);

    const columns = [
      {
        id: "fullName",
        Header: "Name",
        accessor: "full_name"
      }
    ];

    times(query.blank_columns, n => {
      columns.push({
        id: `blankColumn${n}`,
        Header: "",
        accessor: () => "",
        sortable: false
      });
    });

    return columns;
  }

  getData() {
    return this.props.registrations;
  }

  download() {
    const JSPDF = require("jspdf");
    require("jspdf-autotable");

    const title = this.getTitle();
    const data = this.reactTable.getResolvedState().sortedData;
    const columns = this.getColumns().map(col => ({
      title: col.Header,
      dataKey: col.id
    }));

    const totalPagesExp = "{total_pages_count_string}";

    const pageContent = function(data) {
      // HEADER
      doc.setFontSize(14);
      doc.setFontStyle("normal");
      doc.text(title, data.settings.margin.left, 22);

      // FOOTER
      var str = `Page ${data.pageCount} of ${totalPagesExp}`;
      doc.setFontSize(10);
      var pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    };

    const doc = new JSPDF("portrait");

    doc.autoTable(columns, data, {
      theme: "grid",
      addPageContent: pageContent,
      margin: { top: 30 }
    });

    doc.putTotalPages(totalPagesExp);

    doc.save(`${snakeCase(title)}.pdf`);
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
    );
  }
}
