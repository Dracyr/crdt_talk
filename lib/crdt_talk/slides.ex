defmodule CrdtTalk.Slides do
  use GenServer

  def start_link(_whatevs) do
    inital_state = "start"

    GenServer.start_link(__MODULE__, inital_state, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def handle_call({:update, new_slide}, _from, state) do

    IO.inspect("new state #{inspect(new_slide)}")
    {:reply, new_slide, new_slide}
  end

  def handle_call(:status, _from, state) do
    {:reply, state, state}
  end

  def handle_call(:reset, _from, state) do
    inital_state = "start"

    {:reply, inital_state, inital_state}
  end

  def update(data) do
    GenServer.call(__MODULE__, {:update, data})
  end

  def status() do
    GenServer.call(__MODULE__, :status)
  end

  def reset() do
    GenServer.call(__MODULE__, :reset)
  end
end
