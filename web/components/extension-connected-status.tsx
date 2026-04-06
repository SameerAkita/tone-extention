"use client";

import { useEffect, useState } from "react";

export function ExtensionConnectedStatus() {
  const [status, setStatus] = useState("Checking extension connection...");

  useEffect(() => {
    let isActive = true;

    const timeoutId = window.setTimeout(() => {
      if (!isActive) return;
      window.removeEventListener("message", onMessage);
      setStatus("Extension not connected");
    }, 1000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.removeEventListener("message", onMessage);
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== window) return;
      if (event.origin !== window.location.origin) return;

      const message = event.data as
        | { type?: string; connected?: boolean }
        | null;
      if (!message || message.type !== "TONE_EXTENSION_CONNECTION_STATUS") {
        return;
      }

      if (!isActive) return;
      cleanup();
      setStatus(
        message.connected ? "Extension connected" : "Extension not connected",
      );
    }

    window.addEventListener("message", onMessage);
    window.postMessage(
      { type: "TONE_EXTENSION_CONNECTION_PING" },
      window.location.origin,
    );

    return () => {
      isActive = false;
      cleanup();
    };
  }, []);

  return <p>{status}</p>;
}
