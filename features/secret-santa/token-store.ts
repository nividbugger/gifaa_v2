// Remembers a participant's personal token per group on this device, so re-opening the invite link
// takes them straight back to their page. The token is also in the link and the email.

const key = (code: string) => `gifaa:santa:${code}`;

export const rememberToken = (code: string, token: string) => {
  try {
    localStorage.setItem(key(code), token);
  } catch {
    /* private mode: the personal link still works */
  }
};

export const recallToken = (code: string): string | null => {
  try {
    return localStorage.getItem(key(code));
  } catch {
    return null;
  }
};
