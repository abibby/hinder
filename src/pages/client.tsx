import { useEffect } from "react";
import { Client } from "../peer/client";

export function GroupClient() {
  useEffect(() => {
    const h = new Client("hinder-test-id-917349476174");
    h.connect().then(() => {
      h.fetch("a", { foo: "bar" });
    });

    return () => h.close();
  }, []);
  return (
    <div>
      <h1>Client</h1>
    </div>
  );
}
