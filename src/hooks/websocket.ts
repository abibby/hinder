import { useEffect, useState } from "react";

export function useWebsocket<T = unknown>(
  url: string,
  onMessage: (data: T) => void
): [WebSocket | undefined, boolean] {
  const [ws, setWS] = useState<WebSocket>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("connect to " + url);

    const ws = new WebSocket(url);
    ws.addEventListener("open", () => setOpen(true));
    ws.addEventListener("message", (e) => {
      onMessage(JSON.parse(e.data));
    });
    setWS(ws);

    return () => {
      console.log("close " + url);
      ws.close();
    };
  }, [url]);

  return [ws, open];
}
