"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type DownloadState = "checking" | "downloaded" | "not_downloaded";
type ConnectionState = "checking" | "connected" | "not_connected";

export function ExtensionDashboardStatusBox() {
  const [downloadState, setDownloadState] = useState<DownloadState>("checking");
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("checking");
  const downloadResolvedRef = useRef(false);
  const connectionResolvedRef = useRef(false);

  useEffect(() => {
    let isActive = true;
    let downloadAttemptCount = 0;
    let connectionAttemptCount = 0;
    let downloadTimeoutId: number | null = null;
    let connectionTimeoutId: number | null = null;

    function cleanup() {
      if (downloadTimeoutId !== null) {
        window.clearTimeout(downloadTimeoutId);
      }

      if (connectionTimeoutId !== null) {
        window.clearTimeout(connectionTimeoutId);
      }

      window.removeEventListener("message", onMessage);
    }

    function sendDownloadPing() {
      if (!isActive || downloadResolvedRef.current) return;

      downloadAttemptCount += 1;
      window.postMessage({ type: "TONE_EXTENSION_PING" }, window.location.origin);

      if (downloadAttemptCount >= 8) {
        setDownloadState("not_downloaded");
        return;
      }

      downloadTimeoutId = window.setTimeout(sendDownloadPing, 400);
    }

    function sendConnectionPing() {
      if (!isActive || connectionResolvedRef.current) return;

      connectionAttemptCount += 1;
      window.postMessage(
        { type: "TONE_EXTENSION_CONNECTION_PING" },
        window.location.origin,
      );

      if (connectionAttemptCount >= 8) {
        setConnectionState("not_connected");
        return;
      }

      connectionTimeoutId = window.setTimeout(sendConnectionPing, 400);
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== window) return;
      if (event.origin !== window.location.origin) return;

      const message = event.data as
        | { type?: string; connected?: boolean }
        | null;

      if (!message || !isActive) return;

      if (message.type === "TONE_EXTENSION_PONG") {
        downloadResolvedRef.current = true;
        setDownloadState("downloaded");
        if (downloadTimeoutId !== null) {
          window.clearTimeout(downloadTimeoutId);
        }
        return;
      }

      if (message.type === "TONE_EXTENSION_CONNECTION_STATUS") {
        connectionResolvedRef.current = true;
        setConnectionState(
          message.connected ? "connected" : "not_connected",
        );
        if (connectionTimeoutId !== null) {
          window.clearTimeout(connectionTimeoutId);
        }
      }
    }

    window.addEventListener("message", onMessage);
    sendDownloadPing();
    sendConnectionPing();

    return () => {
      isActive = false;
      cleanup();
    };
  }, []);

  if (downloadState === "checking" || connectionState === "checking") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <p className="text-md font-medium">Extension status</p>
        <p className="text-sm text-muted-foreground">Checking...</p>
      </div>
    );
  }

  if (downloadState === "not_downloaded") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <p className="text-md font-medium">Download extension</p>
        <Button type="button" disabled>
          Download extension
        </Button>
      </div>
    );
  }

  if (connectionState === "not_connected") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <p className="text-md font-medium">Connect extension</p>
        <Button asChild>
          <Link href="/connect-extension">Connect extension</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
      <p className="text-md font-medium">Extension connected</p>
      <span className="inline-flex items-center text-green-600">
        <Check className="h-5 w-5" />
      </span>
    </div>
  );
}
