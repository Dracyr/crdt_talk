defmodule CrdtTalkWeb.Router do
  use CrdtTalkWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CrdtTalkWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/presentation", PageController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", CrdtTalkWeb do
  #   pipe_through :api
  # end
end
