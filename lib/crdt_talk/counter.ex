defmodule CrdtTalk.Counter do
  use GenServer

  def start_link(_whatevs) do
    inital_state = %{}
    GenServer.start_link(__MODULE__, inital_state, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def handle_call({:update, update}, _from, state) do
    new_state = Map.merge(state, update, fn _k, v1, v2 -> max(v1, v2) end)
    IO.inspect("new state #{inspect(new_state)}")
    {:reply, new_state, new_state}
  end

  def update(data) do
    GenServer.call(__MODULE__, {:update, data})
  end
end
