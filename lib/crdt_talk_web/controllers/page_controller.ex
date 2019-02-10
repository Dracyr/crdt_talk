defmodule CrdtTalkWeb.PageController do
  use CrdtTalkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
