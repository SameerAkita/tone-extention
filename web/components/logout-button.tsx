"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const syncLogoutToExtension = async () => {
    const response = await new Promise<{ ok?: boolean; error?: string }>(
      (resolve) => {
        const timeoutId = window.setTimeout(() => {
          cleanup();
          resolve({
            error:
              "Extension did not acknowledge logout sync before timeout.",
          });
        }, 1500);

        function onMessage(event: MessageEvent) {
          if (event.source !== window) return;
          if (event.origin !== window.location.origin) return;

          const message = event.data as
            | { type?: string; ok?: boolean; error?: string }
            | null;
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
          { type: "TONE_EXTENSION_AUTH_CLEAR" },
          window.location.origin,
        );
      },
    );

    if (response.error) {
      console.log("extension logout sync", response.error);
    }
  };

  const logout = async () => {
    await syncLogoutToExtension();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
