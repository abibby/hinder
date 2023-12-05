import { DependencyList, useCallback, useEffect, useState } from "react";

export function useWebsocket<T = unknown>(
  url: string,
  onMessage: (data: T, ws: WebSocket) => void,
  deps: DependencyList
): WebSocket | undefined {
  const [ws, setWS] = useState<WebSocket>();

  const messageCB = useCallback(onMessage, deps);

  useEffect(() => {
    console.log("connect to " + url);

    const ws = new WebSocket(url);
    ws.addEventListener("open", () => {
      setWS(ws);
    });
    ws.addEventListener("message", (e) => {
      messageCB(JSON.parse(e.data), ws);
    });

    return () => {
      console.log("close " + url);
      ws.close();
    };
  }, [url]);

  return ws;
}
