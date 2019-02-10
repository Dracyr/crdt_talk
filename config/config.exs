# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :crdt_talk,
  ecto_repos: [CrdtTalk.Repo]

# Configures the endpoint
config :crdt_talk, CrdtTalkWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "+/SmxULHZ/ru+5u8ZYph3JwER0nlVA0942A0YmrjEVbR63kuxZXiW+WLWQCopwTn",
  render_errors: [view: CrdtTalkWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: CrdtTalk.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
