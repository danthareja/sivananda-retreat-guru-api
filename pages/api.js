import React, { Component } from "react";
import dynamic from "next/dynamic";
import { get } from "../api";

import ErrorPage from "./_error.js";

const JSONView = dynamic(import("react-json-view"), {
  ssr: false
});

export default class APIPage extends Component {
  static async getInitialProps(context) {
    const { _endpoint, ...query } = context.query;
    return get(_endpoint, query);
  }

  render() {
    return (
      <div>
        {this.props.error ? (
          <ErrorPage error={this.props.error} />
        ) : (
          <JSONView src={this.props.data} />
        )}
      </div>
    );
  }
}
