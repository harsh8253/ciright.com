const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function ArrowUpRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} strokeWidth={1.8}>
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  )
}

export function Plus({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" {...base} strokeWidth={1.8}>
      <path className="plus-v" d="M10 3.5v13" />
      <path d="M3.5 10h13" />
    </svg>
  )
}
