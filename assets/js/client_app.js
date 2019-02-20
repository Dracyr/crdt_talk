import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Redbox from "redbox-react";
import { AppContainer } from "react-hot-loader";

import Client from "./client";
import socket from "./socket";

const CustomErrorReporter = ({ error }) => <Redbox error={error} />;

CustomErrorReporter.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired
};

ReactDOM.render(
  <AppContainer errorReporter={CustomErrorReporter}>
    <Client socket={socket} />
  </AppContainer>,
  document.getElementById("client_root")
);

if (document.getElementById("client_root").length > 0) {
  if (module.hot) {
    module.hot.accept("./client", () => {
      const NextClient = require("./client").default;
      ReactDOM.render(
        <AppContainer errorReporter={CustomErrorReporter}>
          <NextClient socket={socket} />
        </AppContainer>,
        document.getElementById("client_root")
      );
    });
  }
}
