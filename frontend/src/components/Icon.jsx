export default function Icon({ name, className = '', strokeWidth = 2 }) {
  const props = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (name) {
    case 'home':
      return <svg {...props}><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>
    case 'bag':
      return <svg {...props}><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 016 0" /></svg>
    case 'ticket':
      return <svg {...props}><path d="M3 9a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 010 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 010-4V9z" /><path d="M12 8v8" /></svg>
    case 'bell':
      return <svg {...props}><path d="M6 8a6 6 0 1112 0v5l2 2H4l2-2V8" /><path d="M10 19a2 2 0 004 0" /></svg>
    case 'user':
      return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
    case 'box':
      return <svg {...props}><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>
    case 'chevron-left':
      return <svg {...props}><path d="M15 18l-6-6 6-6" /></svg>
    case 'chevron-right':
      return <svg {...props}><path d="M9 18l6-6-6-6" /></svg>
    case 'warning':
      return <svg {...props}><path d="M12 3l9 16H3L12 3z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    case 'calendar':
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
    case 'dollar':
      return <svg {...props}><path d="M12 3v18" /><path d="M16 7.5a4 4 0 00-4-1.5c-2 0-4 1-4 3s2 3 4 3 4 1 4 3-2 3-4 3a4 4 0 01-4-1.5" /></svg>
    case 'clock':
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    case 'paperclip':
      return <svg {...props}><path d="M21 11.5l-8.5 8.5a5 5 0 01-7-7L14 4.5a3 3 0 014 4L9.5 17a1 1 0 01-1.5-1.5L16 7.5" /></svg>
    case 'phone':
      return <svg {...props}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 014.09 4.18 2 2 0 016 2h3a2 2 0 012 1.72c.12.9.36 1.77.72 2.59a2 2 0 01-.45 2.11L10.7 9.7a16 16 0 006 6l1.28-1.28a2 2 0 012.11-.45c.82.36 1.69.6 2.59.72A2 2 0 0122 16.92z" /></svg>
    case 'credit-card':
      return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
    case 'settings':
      return <svg {...props}><path d="M12 15.5A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 15.5z" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c.12.9.36 1.77.72 2.59a1.65 1.65 0 001.82.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.9.12 1.77.36 2.59.72a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09c-.9.12-1.77.36-2.59.72z" /></svg>
    case 'help':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 115.82 1c0 1.5-2 2-2 2" /><path d="M12 17h.01" /></svg>
    case 'check':
      return <svg {...props}><path d="M20 6L9 17l-5-5" /></svg>
    case 'mail':
      return <svg {...props}><path d="M3 8l9 6 9-6" /><path d="M21 19H3V8" /></svg>
    case 'menu':
      return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'x':
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>
  }
}
