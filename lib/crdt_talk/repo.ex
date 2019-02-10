defmodule CrdtTalk.Repo do
  use Ecto.Repo,
    otp_app: :crdt_talk,
    adapter: Ecto.Adapters.Postgres
end
