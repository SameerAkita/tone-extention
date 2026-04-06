import { ExtensionConnectedStatus } from "@/components/extension-connected-status";
import { DashboardPlaceholder } from "@/components/dashboard-placeholder";
import { ExtensionDownloadStatus } from "@/components/extension-download-status";

export default function DashboardExtensionPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Extension"
      title="Extension setup will live here"
      description="This page can later cover Chrome installation, account connection, troubleshooting, and extension status."
    >
      <ExtensionDownloadStatus />
      <ExtensionConnectedStatus />
    </DashboardPlaceholder>
  );
}
