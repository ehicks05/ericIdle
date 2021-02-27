import humanizeDuration from "humanize-duration";
// UTILITY
export function myRound(value, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(value * multiplier) / multiplier;
}

export function camelToTitle(value) {
  const result = value.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});
