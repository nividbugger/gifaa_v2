import { refreshSessionViaSite } from "@/core/session-source";

export type BackgroundMessage = { type: "refresh-session" };

// The refresh opens a tab, which would close the popup mid-flow if the popup owned it.
export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message?.type === "refresh-session") return refreshSessionViaSite();
  });
});
