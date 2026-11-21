// One branded layout for every Gifaa email. Templates pass plain text only, and this module
// escapes it, so a template can never accidentally inject HTML (names, notes etc. are user input).

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface EmailContent {
  /** Short line shown in inbox previews next to the subject. */
  preheader?: string;
  heading: string;
  paragraphs: string[];
  /** Small muted line, e.g. "Budget ₹1,000 · 24 Dec". */
  details?: string;
  cta?: { label: string; url: string };
  /** Small print under the button, e.g. "Don't forward this link". */
  footnote?: string;
}

export interface RenderedEmail {
  html: string;
  text: string;
}

const ROYAL = "#0a3566";
const MUTED = "#5b6577";
const FAINT = "#8a93a3";

export function renderEmail(content: EmailContent): RenderedEmail {
  const { preheader, heading, paragraphs, details, cta, footnote } = content;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#faf7ef">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>` : ""}
<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;color:#2b3445">
  <p style="font-size:20px;color:${ROYAL};margin:0 0 20px"><strong>Gifaa</strong></p>
  <h2 style="color:${ROYAL};margin:0 0 12px">${escapeHtml(heading)}</h2>
  ${paragraphs.map((p) => `<p style="line-height:1.5">${escapeHtml(p)}</p>`).join("\n  ")}
  ${details ? `<p style="color:${MUTED}">${escapeHtml(details)}</p>` : ""}
  ${cta ? `<p style="margin:24px 0"><a href="${escapeHtml(cta.url)}" style="background:${ROYAL};color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-family:Arial,sans-serif">${escapeHtml(cta.label)}</a></p>` : ""}
  ${footnote ? `<p style="font-size:12px;color:${FAINT}">${escapeHtml(footnote)}</p>` : ""}
  <p style="font-size:12px;color:${FAINT};margin-top:28px">Sent by Gifaa · gifaa.in</p>
</div></body></html>`;

  const text = [
    heading,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...(details ? [details, ""] : []),
    ...(cta ? [`${cta.label}: ${cta.url}`, ""] : []),
    ...(footnote ? [footnote, ""] : []),
    "Sent by Gifaa · gifaa.in",
  ].join("\n");

  return { html, text };
}
