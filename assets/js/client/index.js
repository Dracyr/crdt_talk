// Import React
import React from "react";
import sharedb from "sharedb/lib/client";
import StringBinding from "sharedb-string-binding";
import rews from "reconnecting-websocket";

import whiteDots from "./image4.png";

// Require CSS
require("normalize.css");

// const theme = createTheme(
//   {
//     primary: "white",
//     secondary: "#2C3F6B",
//     tertiary: "black",
//     quaternary: "#CECECE",
//     navy: "#2C3E6B",
//     paleblue: "#7693ba",
//     red: "#E03D58",
//     palered: "#DA7E88",
//     greenish: "#6FAAB3"

//     // 2C3E6B
//     // 6FAAB3
//     // E03D58
//     // DA7E88
//     // 7693BA
//     // FDFEFD
//   },
//   {
//     primary: "proxima_novabold",
//     secondary: "proxima_novalight"
//   }
// );

export default class Client extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crdt: {
        counter: 0,
        neg_counter: 0,
        texts: ["hello", "world"],
        texts_tombstones: []
      },
      text_input: ""
    };

    this.channel = props.socket.channel("room:lobby", {});
    this.channel.on("update", this.receiveUpdate);
    this.textRef = React.createRef();
  }

  componentDidMount() {
    this.channel
      .join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp);
        this.setState({ crdt: resp });
      })
      .receive("error", resp => {
        console.log("Unable to join", resp);
      });

    const socketHost = `ws://${window.location.hostname}:8080`;
    const sharedb_socket = new WebSocket(socketHost);
    const sharedb_connection = new sharedb.Connection(sharedb_socket);
    sharedb_socket.onopen = function() {
      console.log("text connected");
    };

    sharedb_socket.onerror = function(e) {
      console.log("sharedb error", e);
    };

    this.doc = sharedb_connection.get("examples", "textarea");
  }

  receiveUpdate = update => {
    console.log("UPDAET", update);
    this.setState({ crdt: update });
  };

  incrementCounter = () => {
    const newCounter = this.state.crdt.counter + 1;
    // this.setState({ counter: newCounter });
    this.channel.push("update", { ...this.state.crdt, counter: newCounter });
  };

  decrementCounter = () => {
    this.channel.push("update", {
      ...this.state.crdt,
      neg_counter: this.state.crdt.neg_counter + 1
    });
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState({ text_input: value });
  };

  handleKeyPress = event => {
    if (event.key == "¤" && event.shiftKey) {
      this.setState({ text_input: "" });
      this.channel.push("reset");
    }

    if (event.key === "Enter" && this.state.text_input.length >= 1) {
      const set = new Set(this.state.crdt.texts);
      this.state.text_input.split(" ").forEach(t => {
        set.add(t);
      });
      this.setState({ text_input: "" });

      console.log([...set]);
      this.channel.push("update", { ...this.state.crdt, texts: [...set] });
    }
  };

  sendText = () => {
    if (this.state.text_input.length >= 1) {
      const set = new Set(this.state.crdt.texts);
      this.state.text_input.split(" ").forEach(t => {
        set.add(t);
      });
      this.setState({ text_input: "" });

      console.log([...set]);
      this.channel.push("update", { ...this.state.crdt, texts: [...set] });
    }
  };

  removeText = text => {
    this.channel.push("update", {
      ...this.state.crdt,
      texts_tombstones: [...this.state.crdt.texts_tombstones, text]
    });
  };

  activateFulltext = () => {
    if (this.textRef.current) {
      this.doc.subscribe(err => {
        if (err) throw err;

        var binding = new StringBinding(this.textRef.current, this.doc, [
          "content"
        ]);
        // var binding = new StringBinding(this.textRef.current, doc, ["content"]);
        binding.setup();
      });
    }
  };

  render() {
    return (
      <div>
        Hej
        <textarea
          style={{ height: "100%", width: "100%", minHeight: "50vh" }}
          ref={this.textRef}
        />
      </div>
    );
  }
}
