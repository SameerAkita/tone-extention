import { DashboardPlaceholder } from "@/components/dashboard-placeholder";
import { ExtensionDashboardStatusBox } from "@/components/extension-dashboard-status-box";

export default function DashboardPage() {
  return (
    <DashboardPlaceholder
      eyebrow="Tone workspace"
      title="Dashboard content goes here"
      description="The shell is ready. You can plug cards, account details, billing, or extension actions into this main panel whenever you are ready."
    >
      <ExtensionDashboardStatusBox />
    </DashboardPlaceholder>
  );
}
