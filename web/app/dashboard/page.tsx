import { ExtensionConnectedStatus } from "@/components/extension-connected-status";
import { DashboardPlaceholder } from "@/components/dashboard-placeholder";
import { ExtensionDownloadStatus } from "@/components/extension-download-status";

export default function DashboardPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Tone workspace"
      title="Dashboard content goes here"
      description="The shell is ready. You can plug cards, account details, billing, or extension actions into this main panel whenever you are ready."
    >
      <ExtensionDownloadStatus />
      <ExtensionConnectedStatus />
    </DashboardPlaceholder>
  );
}
