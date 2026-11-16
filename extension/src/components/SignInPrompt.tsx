import { config } from "@/core/config";

interface Props {
  status: "signed-out" | "expired";
  onRetry: () => void;
}

/** Login happens on the website (email or Google); we just pick up the resulting session. */
export function SignInPrompt({ status, onRetry }: Props) {
  const openLogin = () => browser.tabs.create({ url: `${config.siteUrl}/login` });
  return (
    <div className="stack center">
      <h2>{status === "expired" ? "Reconnect to Gifaa" : "Sign in to Gifaa"}</h2>
      <p className="muted">Log in on gifaa.in, then come back and click the extension again.</p>
      <button className="btn primary" onClick={openLogin}>Open Gifaa</button>
      <button className="btn link" onClick={onRetry}>I've signed in</button>
    </div>
  );
}
