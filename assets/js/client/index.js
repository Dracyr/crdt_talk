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
        texts_tombstones: [],
      },
      slide: "start",
      text_input: ""
    };

    this.channel = props.socket.channel("room:lobby", {});
    this.channel.on("update", this.receiveUpdate);
    this.channel.on("update_slide", this.receiveSlideUpdate);
    this.textRef = React.createRef();
  }

  componentDidMount() {
    this.channel
      .join()
      .receive("ok", resp => {
        console.log("Joined successfully", resp);
        this.setState({ crdt: resp.crdt, slide: resp.slide });
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

  receiveSlideUpdate = newSlide => {
    console.log("newSlide", newSlide);
    this.setState({slide: newSlide.slide})
    // 'start'
    // 'count_pos'
    // 'count'
    // 'text'
    // 'text_delete'
    // 'fulltext'
    // 'end'
    if (this.state.slide == "fulltext") {
      this.activateFulltext();
    }
  }

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
      <div className="client-container">
        {this.state.slide == "start" && (
          <div className="client-heading">Welcome! <br/> Something cool will happen here soon</div>
        )}
        {this.state.slide == "count_pos" && (
          <div className="counter-container">
            <div className="client-counter">{this.state.crdt.counter}</div>
            <button onClick={this.incrementCounter}>Click me!</button>
          </div>
        )}
        {this.state.slide == "count" && (
          <div  className="counter-container">
            <div className="client-counter">{this.state.crdt.counter - this.state.crdt.neg_counter}</div>
            <div className="client-heading">({this.state.crdt.counter} - {this.state.crdt.neg_counter})</div>
            <button onClick={this.incrementCounter}>More!</button>
            <button onClick={this.decrementCounter}>Less!</button>
          </div>
        )}
        {this.state.slide == "text" && (
          <div className="counter-container">
            <div>{this.state.crdt.texts.map(t => `${t} `)}</div>
            <input
              type="text"
              value={this.state.text_input}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.sendText}>Send</button>
          </div>
        )}
        {this.state.slide == "text_delete" && (
          <div  className="counter-container">
            {this.state.crdt.texts
              .filter(t => !this.state.crdt.texts_tombstones.includes(t))
              .map(t => (
                <span key={t} onClick={() => this.removeText(t)}>
                  {t}{" "}
                </span>
              ))}

            <div>
              <div style={{ marginTop: "5em" }}>
                <input
                  type="text"
                  value={this.state.text_input}
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                />
                <button onClick={this.sendText}>Send</button>
              </div>

              <span>Try touching a word!</span>
            </div>
          </div>
        )}
        {this.state.slide == "fulltext" && (
          <div>
            <textarea ref={this.textRef}
                      style={{ height: "100%", width: "100%", minHeight: "50vh" }} />
          </div>
        )}
        {this.state.slide == "end" && (
          <div className="client-heading">Nothing more is going to happen here, all your attention belong to me</div>
        )}

        {this.state.slide == "final" && (
          <div className="client-heading">Thanks for listening!</div>
        )}
      </div>
    );
  }
}
