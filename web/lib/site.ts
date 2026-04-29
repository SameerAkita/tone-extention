export const siteConfig = {
  name: "Tone",
  description:
    "Tone is a browser extension that rewrites rough drafts into polished business Japanese for email, chat, and web-based tools.",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@replace-before-launch.com",
  supportEmailNeedsUpdate: !process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
};
