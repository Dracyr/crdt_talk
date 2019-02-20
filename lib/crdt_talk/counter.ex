defmodule CrdtTalk.Counter do
  use GenServer

  def start_link(_whatevs) do
    inital_state = %{
      counter: 0,
      neg_counter: 0,
      texts: ["hello", "world"],
      texts_tombstones: []
    }

    GenServer.start_link(__MODULE__, inital_state, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def update_counter(state, nil), do: state
  def update_counter(state, update), do: max(update, state)

  def handle_call(
        {:update,
         %{
           "counter" => counter,
           "neg_counter" => neg_counter,
           "texts" => texts,
           "texts_tombstones" => texts_tombstones
         }},
        _from,
        state
      ) do
    new_state = %{
      state
      | counter: update_counter(state.counter, counter),
        neg_counter: max(neg_counter, state.neg_counter),
        texts: MapSet.new(texts ++ state.texts) |> MapSet.to_list(),
        texts_tombstones:
          MapSet.new(texts_tombstones ++ state.texts_tombstones) |> MapSet.to_list()
    }

    # new_state = Map.merge(state, update, fn _k, v1, v2 -> max(v1, v2) end)
    IO.inspect("new state #{inspect(new_state)}")
    {:reply, new_state, new_state}
  end

  def handle_call({:update, _}, _from, state), do: {:reply, state, state}

  def handle_call(:status, _from, state) do
    {:reply, state, state}
  end

  def handle_call(:reset, _from, state) do
    inital_state = %{
      counter: 0,
      neg_counter: 0,
      texts: ["hello", "world"],
      texts_tombstones: []
    }

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
