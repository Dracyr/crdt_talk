defmodule CrdtTalkWeb.RoomChannel do
  use CrdtTalkWeb, :channel

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, %{
        crdt: CrdtTalk.Counter.status(),
        slide: CrdtTalk.Slides.status()
      }, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("update", update, socket) do
    IO.inspect("we got clientU #{inspect(update)}")
    new_state = CrdtTalk.Counter.update(update)
    broadcast(socket, "update", new_state)
    IO.inspect("new state was #{inspect(new_state)}")
    {:noreply, socket}
  end

  def handle_in("update_slide", update, socket) do
    IO.inspect("we got clientU #{inspect(update)}")
    new_state = CrdtTalk.Slides.update(update)
    broadcast(socket, "update_slide", %{ slide: new_state })
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
