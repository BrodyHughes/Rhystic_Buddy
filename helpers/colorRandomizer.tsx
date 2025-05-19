/**
 * Utility that returns a colour from a preset palette.
 *
 * – No React hooks, no dependencies.
 * – If you pass a `seed`, the *same* seed will always map to the
 *   *same* colour (deterministic hash → palette index).
 * – If you omit the seed, the colour is chosen randomly each call.
 */

export const PALETTE = [
  '#3D3A8C', // deep sapphire
  '#256EA9', // dark cerulean
  '#0D6E6E', // smoky teal
  '#7E2553', // mulberry
  '#53317D', // amethyst
  '#AA005F', // boysenberry
  '#8C5A00', // bronze ochre
  '#153E90', // lapis lazuli
] as const;

export type PaletteColor = (typeof PALETTE)[number];

export default function randomColor(): PaletteColor {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
