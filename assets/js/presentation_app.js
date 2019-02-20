import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import Redbox from "redbox-react";
import { AppContainer } from "react-hot-loader";

import Presentation from "./presentation";
import socket from "./socket";

if (document.getElementById("presentation")) {
  const CustomErrorReporter = ({ error }) => <Redbox error={error} />;

  CustomErrorReporter.propTypes = {
    error: PropTypes.instanceOf(Error).isRequired
  };

  ReactDOM.render(
    <AppContainer errorReporter={CustomErrorReporter}>
      <Presentation socket={socket} />
    </AppContainer>,
    document.getElementById("presentation")
  );

  if (module.hot) {
    module.hot.accept("./presentation", () => {
      const NextPresentation = require("./presentation").default;
      ReactDOM.render(
        <AppContainer errorReporter={CustomErrorReporter}>
          <NextPresentation socket={socket} />
        </AppContainer>,
        document.getElementById("presentation")
      );
    });
  }
}
