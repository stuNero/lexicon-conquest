import React, { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("/gamehub")
  .withAutomaticReconnect()
  .build();

const SignalRContext = createContext(connection);

export const SignalRProvider = (
  { children }: { children: React.ReactNode; }
) => {
  const [ready, SetReady] = useState(false);
  useEffect(() => {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      connection.start()
        .then(() => SetReady(true))
        .catch(console.error);
    }
  }, []);

  return (
    <SignalRContext.Provider value={connection}>
      {ready ? children : null}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);