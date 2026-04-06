"use client";

import { useEffect, useState } from "react";

export function ExtensionDownloadStatus() {
  const [status, setStatus] = useState("Checking extension status...");

  useEffect(() => {
    let isActive = true;
    let attemptCount = 0;
    let pollTimeoutId: number | null = null;

    function cleanup() {
      if (pollTimeoutId !== null) {
        window.clearTimeout(pollTimeoutId);
      }
      window.removeEventListener("message", onMessage);
    }

    function sendPing() {
      if (!isActive) return;

      attemptCount += 1;
      window.postMessage({ type: "TONE_EXTENSION_PING" }, window.location.origin);

      if (attemptCount >= 8) {
        setStatus("Extension not downloaded");
        cleanup();
        return;
      }

      pollTimeoutId = window.setTimeout(sendPing, 400);
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== window) return;
      if (event.origin !== window.location.origin) return;

      const message = event.data as { type?: string } | null;
      if (!message || message.type !== "TONE_EXTENSION_PONG") return;

      if (!isActive) return;
      cleanup();
      setStatus("Extension downloaded");
    }

    window.addEventListener("message", onMessage);
    sendPing();

    return () => {
      isActive = false;
      cleanup();
    };
  }, []);

  return <p>{status}</p>;
}
