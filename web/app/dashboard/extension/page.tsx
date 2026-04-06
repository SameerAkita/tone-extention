import { DashboardPlaceholder } from "@/components/dashboard-placeholder";
import { ExtensionSetupPanel } from "@/components/extension-setup-panel";

export default function DashboardExtensionPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Extension"
      title="Tone extension setup"
      description="This page can later cover Chrome installation, account connection, troubleshooting, and extension status."
    >
      <ExtensionSetupPanel />
    </DashboardPlaceholder>
  );
}
