use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :crdt_talk, CrdtTalkWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :crdt_talk, CrdtTalk.Repo,
  username: "postgres",
  password: "postgres",
  database: "crdt_talk_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
