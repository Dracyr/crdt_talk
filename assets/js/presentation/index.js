// Import React
import React from "react";
import sharedb from "sharedb/lib/client";
import StringBinding from "sharedb-string-binding";
import rews from "reconnecting-websocket";

import coloredDots from "./image2.png";
import whiteDots from "./image4.png";

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  Image,
  List,
  ListItem,
  Notes,
  Quote,
  Slide,
  Text,
  Appear,
  CodePane,
  Code,
  Fill,
  Layout,
  Fit,
  Magic
} from "spectacle";

// Import theme
import createTheme from "spectacle/lib/themes/default";

const images = {};
// formidagon: require("../assets/formidable-logo.svg"),
// goodWork: require("../assets/good-work.gif")

// Require CSS
require("normalize.css");

const theme = createTheme(
  {
    primary: "white",
    secondary: "#2C3F6B",
    tertiary: "black",
    quaternary: "#CECECE",
    navy: "#2C3E6B",
    paleblue: "#7693ba",
    red: "#E03D58",
    palered: "#DA7E88",
    greenish: "#6FAAB3"

    // 2C3E6B
    // 6FAAB3
    // E03D58
    // DA7E88
    // 7693BA
    // FDFEFD
  },
  {
    primary: "proxima_novabold",
    secondary: "proxima_novalight"
  }
);

export default class Presentation extends React.Component {
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
    this.activateSlide('fulltext')
    console.log(this.textRef);
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

  handleStateChange = (state, newState) => {
    console.log(state, newState);
  }

  activateSlide = (slide) => {
    console.log("Activate ", slide);
    this.channel.push("update_slide", slide);
  }

  render() {
    return (
      <Deck
        transition={["slide"]}
        transitionDuration={500}
        theme={theme}
        controls={false}
        showFullscreenControl={false}
        contentWidth="90vw"
        onStateChange={this.handleStateChange}
      >
        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
          onActive={() => this.activateSlide('start')}
        >
          <Heading
            textAlign="left"
            size={1}
            caps
            lineHeight={1}
            textColor="primary"
          >
            What the heck is a CRDT?
          </Heading>

          <Notes>
            What the heck is the thing
            <p>
              In anwering that, we are going to touch on some interesting topics
              in distributed computing, we are going to collaborate a bit, and
              hopefully add one more tool to your tech-toolboxes.
            </p>
            <p>if questions</p>
          </Notes>
        </Slide>

        <Slide bgImage={coloredDots} bgPosition="38vh top">
          <Heading
            textAlign="left"
            size={2}
            lineHeight={1}
            textColor="tertiary"
          >
            Did the clicker work?
          </Heading>
          <Heading size={4} textAlign="left" textColor="secondary">
            crdt.pvpersson.se
          </Heading>
        </Slide>

        <Slide>
          <Heading size={2} fit lineHeight={1} textColor="tertiary">
            Conflict-Free Replicated Data Type
          </Heading>
          <Appear>
            <Heading size={3} fit lineHeight={1} textColor="secondary">
              Join Semi-Lattice
            </Heading>
          </Appear>

          <Notes>
            appear: join semi-lattice
            I know you are engineers
          </Notes>
        </Slide>

        <Slide>
          <Image src="/images/operations.png" />
          <Notes>
            name is selfexplanatory
            <p>reverse order</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={1} textColor="secondary">
            data-Type
          </Heading>
          <Appear>
            <div>
              <Heading
                textAlign="left"
                size={3}
                margin="10vh 0 0"
                textColor="tertiary"
              >
                a thing
              </Heading>
            </div>
          </Appear>

          <Notes>
            a thing. put things in
            you prrogrammed

            <p>advanced b-trees</p>
            <p>but now we know it's a thing</p>
            <p>nextup: d&d</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={2} textColor="secondary">
            Replicated & Distributed
          </Heading>
          <Image width="40vw" margin="0.5em 0 0" src="/images/nodes.png" />
          <Notes>
            cheating, closely related
            <p>mention git, no dependencies</p>
            <p>changes everywhere get to everybody</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={1} textColor="secondary">
            Commutative
          </Heading>
          <Appear>
            <Heading
              size={1}
              textAlign="left"
              margin="0.5em 0 0"
              textColor="secondary"
            >
              Convergent
            </Heading>
          </Appear>
          <Appear>
            <Image margin="0.5em 0 0" src="/images/paper.png" />
          </Appear>

          <Notes>
            <p>Paper from 2011</p>
            <p>Like git, sometimes two person do things and then nextup</p>
            <p>Nextup: image of git</p>
          </Notes>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Image width="50vw" src="/images/merge.png" />
          <Notes>
            <p>git doesnt know</p>
            <p>don't solve using agile coaches</p>
            <p>not semantically correct, but no conflicts</p>
            <p>nextup: what was the problem</p>
          </Notes>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading
            textAlign="left"
            size={1}
            caps
            lineHeight={1}
            textColor="primary"
          >
            What did we want to do now again?
          </Heading>
          <Notes>
            <p>so we know what the words mean</p>
            <p>recap words, we have a thing. Cool cool cool</p>
            <p>git was these things</p>
            <p>Other tech like games have state</p>
            <p>can be used for a lot of things, but I have teased text, what text problem are we solvign?</p>
            <p>nextup is text: network</p>
          </Notes>
        </Slide>

        <Slide align="center flex-start">
          <Image width="50vw" src="/images/network.png" />
          <Notes>
            <p>nextup idempotenxy</p>
          </Notes>
        </Slide>

        <Slide align="center flex-start">
          <Image width="50vw" src="/images/idempotency.png" />
          <Notes>
            <p>lots of people</p>
            <p>nextup lets build one</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={2} textColor="secondary">
            Let's build one!
          </Heading>
          <Notes>
            <p>boid spring birdcounters</p>
            <p>sync at end of day, no internet</p>
            <p>nextup counter</p>
          </Notes>
        </Slide>

        <Slide onActive={() => this.activateSlide('count')}>
          <Layout>
            <Fill>
              <CodePane
                textSize={30}
                margin="0 0 1em"
                source={`
crdt = 0

merge(c1, c2) => max(c1, c2)
              `}
              />

              <button onClick={this.incrementCounter}>Click me!</button>
            </Fill>

            <Fill>
              <Text textSize={120} textColor="secondary">
                {this.state.crdt.counter}
              </Text>
            </Fill>
          </Layout>
          <Notes>
            <p>we have a dataype, and merge function</p>
            <p>it has problem though, what?</p>
            <p>nextup decrement</p>
          </Notes>
        </Slide>

        <Slide onActive={() => this.activateSlide('count_pos')}>
          <Layout>
            <Fill>
              <CodePane
                textSize={30}
                margin="0 0 1em"
                source={`
crdt = {
  pos: 0,
  neg: 0
}

merge(c1, c2) =>
  pos: max(c1.pos, c2.pos),
  neg: max(c1.neg, c2.neg)

display(c) = c.pos - c.neg
              `}
              />

            </Fill>

            <Fill>
              <Text textSize={120} textColor="secondary">
                {this.state.crdt.counter - this.state.crdt.neg_counter}
              </Text>
              <Text textSize={72}>
                {this.state.crdt.counter} - {this.state.crdt.neg_counter}
              </Text>

              <button
                style={{ marginRight: "1em" }}
                onClick={this.incrementCounter}
              >
                More!
              </button>
              <button onClick={this.decrementCounter}>Less!</button>
            </Fill>
          </Layout>
          <Notes>
            <p>does everybody get why two parts?</p>
            <p>+ is itdempotent</p>
            <p>now we have a display functions</p>
            <p>nextup strings</p>
          </Notes>
        </Slide>

        <Slide bgImage={coloredDots} bgPosition="38vh top">
          <CodePane
            textSize={30}
            margin="0 0 1em"
            source={`
crdt = ["hello", "world"]

merge(c1, c2) => union(c1, c2)
              `}
          />
          <Image src="/images/all-the-things.png" />
        </Slide>

        <Slide onActive={() => this.activateSlide('text')} bgImage={coloredDots} bgPosition="38vh top">
          <Text textSize={42}>{this.state.crdt.texts.map(t => `${t} `)}</Text>

          <div style={{ marginTop: "5em" }}>
            <input
              type="text"
              value={this.state.text_input}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.sendText}>Send</button>
          </div>
          <Notes>
            <p>we do a similar operation here, </p>
            <p>awesome, there's 2 problems though</p>
            <p>nextup is deleting things, tombstones</p>
            <p>after that is orderign</p>
          </Notes>
        </Slide>

        <Slide bgColor="red" bgImage={whiteDots} bgPosition="38vh top">
          <Heading textAlign="left">Deleting things?</Heading>
          <Heading
            textAlign="left"
            textColor="primary"
            size={2}
            margin="2em 0 0"
          >
            Tombstones
          </Heading>
          <Notes>
            <p>so how do we make removing idempotent</p>
            <p>we add a second set of tombstones</p>
            <p>nextup delete demo</p>
          </Notes>
        </Slide>

        <Slide onActive={() => this.activateSlide('text_delete')} bgImage={coloredDots} bgPosition="38vh top">
          <Text textSize={42}>
            {this.state.crdt.texts
              .filter(t => !this.state.crdt.texts_tombstones.includes(t))
              .map(t => (
                <span key={t} onClick={() => this.removeText(t)}>
                  {t}{" "}
                </span>
              ))}
          </Text>

          <div style={{ marginTop: "5em" }}>
            <input
              type="text"
              value={this.state.text_input}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.sendText}>Send</button>
          </div>
          <Notes>
            <p>problem tho</p>
            <p>we cant add third set</p>
            <p>nextup deleting things</p>
            <p>nextup tombstone id</p>
          </Notes>
        </Slide>

        <Slide bgColor="red" bgImage={whiteDots} bgPosition="38vh top">
          <Heading margin="0 0 0.5em" textAlign="left">
            Deleting things, again
          </Heading>
          <Layout>
            <Fill>
              <CodePane
                lang="ruby"
                textSize={30}
                source={`
crdt = {
  texts: {
    1: "Hello",
    2: "World"
  },
  tombstones: [1]
}

`}
              />
            </Fill>
            <Fill>
              <List margin="1em" textColor="tertiary" ordered start={1}>
                <ListItem>Tombstones</ListItem>
                <ListItem>Add a unique ID</ListItem>
                <ListItem>OR-Set (if they are odd)</ListItem>
                <ListItem>LWW, Last Write Wins</ListItem>
              </List>
            </Fill>
          </Layout>
          <Notes>
            <p>add id instead, UUID</p>
            <p>OR-Set, even odd</p>
            <p>LWW, using vector clocks</p>
            <p>Nextup ordering!</p>
          </Notes>
        </Slide>

        <Slide bgImage={coloredDots} bgPosition="38vh top">
          <Heading caps textAlign="left" size={1} textColor="navy">
            The final trick <br />
            ordering!
          </Heading>
        </Slide>

        <Slide bgImage={coloredDots} bgPosition="38vh top">
          <Heading caps textAlign="left" size={1} textColor="navy">
            Order using?
          </Heading>
          <List textColor="tertiary" ordered start={1}>
            <Appear>
              <ListItem>Integers?</ListItem>
            </Appear>
            <Appear>
              <ListItem>Rational numbers (floats)?</ListItem>
            </Appear>
            <Appear>
              <ListItem>Lists!</ListItem>
            </Appear>
          </List>

          <Appear>
            <CodePane
              lang="ruby"
              textSize={30}
              source={`
[1], [4] -> [1], [2], [4]

[1], [2] -> [1] [1, 5] [2]

         -> [1] [1, 5] [1, 6] [2]

         -> [1] [1, 5] [1, 5, 5] [1, 6] [2]
            `}
            />
          </Appear>
          <Notes>
            <p>appear: integer</p>
            <p>appear: rational number</p>
            <p>there are langs with rat numbers, you dont love ruby</p>
            <p>appear: lists! logoot</p>
            <p>nextup textarea!</p>
          </Notes>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          onActive={this.activateFulltext}
        >
          <textarea
            style={{ height: "100%", width: "100%", minHeight: "50vh" }}
            ref={this.textRef}
          />
          <Notes>
            <p>everythgin</p>
            <p>nextup: lies</p>
          </Notes>
        </Slide>

        <Slide
          onActive={() => this.activateSlide('end')}
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading
            textAlign="left"
            size={1}
            caps
            lineHeight={1}
            textColor="primary"
          >
            On Reality, A brief interlude
          </Heading>
          <p>nextup: not google docs</p>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading
            textAlign="left"
            size={1}
            caps
            lineHeight={1}
            textColor="primary"
          >
            Google Docs doesn't use CRDTs!
          </Heading>

          <Appear>
            <Heading
              margin="1em 0 0"
              textAlign="left"
              size={2}
              caps
              lineHeight={1}
              textColor="primary"
            >
              It's all OT
            </Heading>
          </Appear>

          <Appear>
            <Heading
              margin="1em 0 0"
              textAlign="left"
              size={2}
              caps
              lineHeight={1}
              textColor="primary"
            >
              Operational Transforms
            </Heading>
          </Appear>
          <Notes>
            <p>They didnt exist in 2011</p>
            <p>More complex, nextup quote</p>
            <p>Short explanation of difference</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <BlockQuote>
            <Quote textSize={42} textColor="secondary">
              Unfortunately, implementing OT sucks. There's a million algorithms
              with different tradeoffs, mostly trapped in academic papers. The
              algorithms are really hard and time consuming to implement
              correctly. […] Wave took 2 years to write and if we rewrote it
              today, it would take almost as long to write a second time.
            </Quote>
            <Cite>Joseph Gentle, on Google Wave</Cite>
          </BlockQuote>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading
            textAlign="left"
            size={2}
            caps
            lineHeight={1}
            textColor="primary"
          >
            Anything else?
          </Heading>
          <Notes>
            <p>nextup reasons</p>
          </Notes>
        </Slide>

        <Slide
          bgColor="navy"
          textColor="primary"
          bgImage={whiteDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading
            textAlign="left"
            size={2}
            caps
            lineHeight={1}
            textColor="primary"
          >
            Anything else?
          </Heading>
          <List textColor="primary" textSize={72} ordered start={1}>
            <Appear>
              <ListItem>Memory Size</ListItem>
            </Appear>
            <Appear>
              <ListItem>
                Transfer size
                <List>
                  <ListItem>We can do deltas</ListItem>
                </List>
              </ListItem>
            </Appear>
            <Appear>
              <ListItem>
                It ain't ACID
                <List>
                  <ListItem>It is SEC</ListItem>
                </List>
              </ListItem>
            </Appear>
          </List>
          <Notes>
            <p>appear: memory</p>
            <p>appear: bandwith, deltas</p>
            <p>Not ACID, but SEC</p>
            <p>nextup alternatives</p>
          </Notes>
        </Slide>

        <Slide bgColor="greenish">
          <Layout>
            <Fill>
              <Image width="20vw" src="/images/k8s-logo.png" />
              <Image width="30vw" src="/images/docker-logo.png" />
            </Fill>
            <Fill>
              <Image width="20vw" src="/images/etcd-logo.png" />
              <Image width="20vw" src="/images/consul-logo.png" />
            </Fill>
          </Layout>
          <Notes>
            <p>other things, they do raft</p>
            <p>accept writes at every location and have low latency</p>
            <p>geodistributed</p>
            <p>CAP theorom, CRDT=AP raft stuff = CP</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textColor="secondary" size={2}>
            CRDTs are for distributed data <br />
            where every node needs to modify it
          </Heading>
        </Slide>

        <Slide bgColor="greenish">
          <Heading size={2}>
            You did say other people uses CRDTs for "not text"
          </Heading>
          <Appear>
            <List>
              <ListItem>Phoenix Presence</ListItem>
              <ListItem>Redis cache</ListItem>
              <ListItem>SoundCloud</ListItem>
              <ListItem>Leage of Legends chat</ListItem>
              <ListItem>Teletype for Atom</ListItem>
            </List>
          </Appear>
          <Notes>
            <p>appear: things</p>
            <p>mostly text though</p>
          </Notes>
        </Slide>

        <Slide
          bgImage={whiteDots}
          bgColor="navy"
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={2} textColor="white">
            Almost done!
          </Heading>
          <Notes>
            Wrap up, next is just thank you
            <p>recap, background, built one, laughed and discussed where to use them</p>
          </Notes>
        </Slide>

        <Slide
          onActive={() => this.activateSlide('final')}
          bgImage={coloredDots}
          bgPosition="38vh top"
          align="flex-start center"
        >
          <Heading textAlign="left" size={2} textColor="secondary">
            Thank you!
          </Heading>
        </Slide>
      </Deck>
    );
  }
}
