defmodule CrdtTalkWeb.PageController do
  use CrdtTalkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def show(conn, _params) do
    render(conn, "presentation.html")
  end
end
