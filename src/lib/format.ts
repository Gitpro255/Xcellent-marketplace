export function money(kobo: number) {
  return "\u20A6" + Math.round(kobo / 100).toLocaleString("en-NG");
}

export function nairaToKobo(naira: number) {
  return Math.round(naira * 100);
}
