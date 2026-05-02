export default function Logo() {
  return (
    <svg width="220" height="60" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
      <g transform="translate(10,10)">
        <circle cx="20" cy="20" r="6" fill="url(#logoGold)" />
        <path
          d="M20 26 L12 40 M20 26 L20 42 M20 26 L28 40"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 14 L26 8 L32 12 L40 4"
          fill="none"
          stroke="url(#logoGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polygon points="40,4 36,4 39,1" fill="#FFD700" />
      </g>
      <text
        x="70"
        y="38"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="#FFFFFF"
      >
        Trade<tspan fill="#FFD700">Roots</tspan>
      </text>
    </svg>
  )
}
