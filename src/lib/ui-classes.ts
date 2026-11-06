/**
 * Literal class maps — single source of truth for component classes.
 * Stancona component-twin rule: never interpolate class names
 * (`badge-${color}` is a bug). Variants are keys of these maps.
 */

export const badge = {
  /** neutral tag */
  default: 'badge badge-soft px-2 py-0.5',
  /** highlighted tag (first tag in a group) */
  primary: 'badge badge-soft badge-success px-2 py-0.5',
} as const;

export const card = {
  /** default bordered card — equal height via flex column */
  default: 'bg-base-200 border border-base-300 rounded-box p-6 hover:border-primary transition-colors h-full flex flex-col',
} as const;

export const icon = {
  base: 'w-5 h-5 text-primary mb-4',
} as const;

export type BadgeVariant = keyof typeof badge;
