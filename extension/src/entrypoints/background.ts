import { refreshSessionViaSite } from "@/core/session-source";

export type BackgroundMessage = { type: "refresh-session" };

// The refresh opens a tab, which would close the popup mid-flow if the popup owned it.
export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: BackgroundMessage, _sender, sendResponse) => {
    if (message?.type !== "refresh-session") return;
    // sendResponse + `return true` works in every browser; returning a Promise doesn't in Chrome.
    refreshSessionViaSite().then(sendResponse, () => sendResponse({ status: "signed-out" }));
    return true;
  });
});
