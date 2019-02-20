defmodule CrdtTalkWeb.RoomChannel do
  use CrdtTalkWeb, :channel

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      state = CrdtTalk.Counter.status()
      IO.inspect(state)
      {:ok, state, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  def handle_in("update", update, socket) do
    IO.inspect("we got clientU #{inspect(update)}")
    new_state = CrdtTalk.Counter.update(update)
    broadcast(socket, "update", new_state)
    IO.inspect("new state was #{inspect(new_state)}")
    {:noreply, socket}
  end

  def handle_in("reset", _, socket) do
    new_state = CrdtTalk.Counter.reset()
    broadcast(socket, "update", new_state)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
