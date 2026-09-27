const PREFIX = "codequest.intro.v1";

export function readIntroDismissed(playerId: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`${PREFIX}.${playerId}`) === "1";
}

export function writeIntroDismissed(playerId: string) {
  window.localStorage.setItem(`${PREFIX}.${playerId}`, "1");
}
