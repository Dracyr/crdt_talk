// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket";

// let clients pick, or auto generate this. Then store it in localstorage as well.
let my_name = "a";

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("room:lobby", {});
channel
  .join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp);
  })
  .receive("error", resp => {
    console.log("Unable to join", resp);
  });

channel.on("update", resp => {
  console.log(resp);
  updateCounter(resp[my_name]);
});

let inc_button = document.getElementById("inc");
let dec_button = document.getElementById("dec");

let counter = 0;

let updateCounter = c => {
  document.getElementById("counter").innerText = c;
};

inc_button.addEventListener("click", e => {
  counter += 1;
  // updateCounter(counter);
  channel.push("update", { name: my_name, counter: counter });
});

dec_button.addEventListener("click", e => {
  counter -= 1;
  // updateCounter(counter);
  channel.push("update", { name: my_name, counter: counter });
});
