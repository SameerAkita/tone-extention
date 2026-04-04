"use client";

import { useEffect, useState } from "react";

export function ExtensionDownloadStatus() {
  const [status, setStatus] = useState("Checking extension status...");

  useEffect(() => {
    let isActive = true;

    const timeoutId = window.setTimeout(() => {
      if (!isActive) return;
      window.removeEventListener("message", onMessage);
      setStatus("Extension not downloaded");
    }, 1000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.removeEventListener("message", onMessage);
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
    window.postMessage({ type: "TONE_EXTENSION_PING" }, window.location.origin);

    return () => {
      isActive = false;
      cleanup();
    };
  }, []);

  return <p>{status}</p>;
}
