"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TokenResponse = {
  token: string;
  expiresAt: number;
  user: {
    id: string;
    email?: string;
  };
};

type ConnectAck = {
  ok?: boolean;
  error?: string;
};

export default function ConnectExtensionPage() {
  const [status, setStatus] = useState<string>("Ready to connect");
  const [loading, setLoading] = useState(false);
  const [tokenPreview, setTokenPreview] = useState<string>("");
  const attemptedAutoConnectRef = useRef(false);

  async function connect() {
    setLoading(true);
    setStatus("Requesting extension token...");

    try {
      const res = await fetch("/api/extension/token", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus(body.error ?? "Could not create token. Sign in and try again.");
        return;
      }

      const data = (await res.json()) as TokenResponse;
      setTokenPreview(`${data.token.slice(0, 16)}...${data.token.slice(-8)}`);

      setStatus("Sending token to extension...");
      const response = await new Promise<ConnectAck>((resolve) => {
        const timeoutId = window.setTimeout(() => {
          cleanup();
          resolve({
            error:
              "Extension did not respond. Make sure it is installed and refresh this page.",
          });
        }, 3000);

        function onMessage(event: MessageEvent) {
          if (event.source !== window) return;
          if (event.origin !== window.location.origin) return;

          const message = event.data as { type?: string; ok?: boolean; error?: string } | null;
          if (!message || message.type !== "TONE_EXTENSION_AUTH_RESULT") return;

          cleanup();
          resolve({ ok: message.ok, error: message.error });
        }

        function cleanup() {
          window.clearTimeout(timeoutId);
          window.removeEventListener("message", onMessage);
        }

        window.addEventListener("message", onMessage);
        window.postMessage(
          { type: "TONE_EXTENSION_AUTH_SET", token: data.token },
          window.location.origin,
        );
      });

      if (response?.error) {
        setStatus(`Could not connect extension: ${response.error}`);
        return;
      }

      const expiresAt = new Date(data.expiresAt * 1000).toLocaleString();
      setStatus(`Connected. Token sent to extension for ${data.user.email ?? data.user.id}. Expires ${expiresAt}.`);
    } catch (err) {
      console.error(err);
      setStatus("Failed to connect extension.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (attemptedAutoConnectRef.current) return;
    attemptedAutoConnectRef.current = true;
    void connect();
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Connect Extension</CardTitle>
          <CardDescription>
            Link your signed-in web account to the browser extension automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={connect} disabled={loading} className="w-full">
            {loading ? "Connecting..." : "Connect Extension"}
          </Button>

          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">Status</p>
            <p className="mt-1 text-muted-foreground">{status}</p>
            {tokenPreview && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Token: {tokenPreview}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
